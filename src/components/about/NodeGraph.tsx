"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Node {
    id: string;
    text: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    targetX: number;
    targetY: number;
    isRecentlyDragged?: boolean; // 최근 드래그된 노드인지 표시
    dragEndTime?: number; // 드래그가 끝난 시간
}

interface Connection {
    from: string;
    to: string;
    length: number;
}

interface SVGBounds {
    width: number;
    height: number;
}

interface DragOffset {
    x: number;
    y: number;
}

const NodeGraph: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const animationRef = useRef<number | null>(null);
    const idleTimeRef = useRef<number>(0);
    const lastInteractionRef = useRef<number>(Date.now());
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [draggedNode, setDraggedNode] = useState<Node | null>(null);
    const [dragOffset, setDragOffset] = useState<DragOffset>({ x: 0, y: 0 });
    const [svgBounds, setSvgBounds] = useState<SVGBounds>({ width: 1000, height: 500 });

    // 초기 노드 데이터 (자연스러운 분산 배치)
    const initialNodes: Node[] = [
        { id: 'citizen', text: '일반 시민(가족)', x: 450, y: 120, vx: 0, vy: 0, targetX: 450, targetY: 120 },
        { id: 'self', text: '자조모임', x: 200, y: 180, vx: 0, vy: 0, targetX: 200, targetY: 180 },
        { id: 'committee', text: '후원/협력기관', x: 350, y: 320, vx: 0, vy: 0, targetX: 350, targetY: 320 },
        { id: 'family', text: '한부모가족', x: 650, y: 200, vx: 0, vy: 0, targetX: 650, targetY: 200 },
        { id: 'volunteer', text: '자원봉사자', x: 550, y: 380, vx: 0, vy: 0, targetX: 550, targetY: 380 }
    ];

    // 화면 크기에 따른 연결선 길이 계산
    const getConnectionLength = useCallback(() => {
        const isMobile = svgBounds.width < 768; // 768px 미만을 모바일로 판단
        return isMobile ? 150 : 300; // 모바일: 150, 데스크톱: 300 (250에서 증가)
    }, [svgBounds.width]);

    // 연결 관계 (화면 크기에 따라 동적으로 길이 조정)
    const connections: Connection[] = [
        { from: 'citizen', to: 'self', length: getConnectionLength() },
        { from: 'citizen', to: 'family', length: getConnectionLength() },
        { from: 'self', to: 'committee', length: getConnectionLength() },
        { from: 'committee', to: 'volunteer', length: getConnectionLength() },
        { from: 'volunteer', to: 'family', length: getConnectionLength() }
    ];

    const [nodes, setNodes] = useState<Node[]>(initialNodes);

    // SVG 크기 감지 및 업데이트
    useEffect(() => {
        const updateSvgBounds = () => {
            if (svgRef.current) {
                const rect = svgRef.current.getBoundingClientRect();
                setSvgBounds({
                    width: rect.width,
                    height: rect.height
                });
            }
        };

        // 초기 크기 설정
        updateSvgBounds();

        // 리사이즈 감지
        const resizeObserver = new ResizeObserver(updateSvgBounds);
        if (svgRef.current) {
            resizeObserver.observe(svgRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    // 노드 간 거리 계산
    const getDistance = (node1: Node, node2: Node): number => {
        return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
    };

    // 물리 시뮬레이션 함수
    const updatePhysics = useCallback(() => {
        setNodes(prevNodes => {
            const newNodes = [...prevNodes];
            const currentTime = Date.now();
            const timeSinceLastInteraction = currentTime - lastInteractionRef.current;
            const isIdle = timeSinceLastInteraction > 2000 && !isDragging; // 2초 후 idle 모드

            // 동적 경계 계산 (텍스트가 잘리지 않도록 충분한 여백)
            const margin = 40; // 5에서 40으로 대폭 증가 (텍스트 보호)
            const minX = margin;
            const maxX = svgBounds.width - margin;
            const minY = margin;
            const maxY = svgBounds.height - margin;

            // Idle 애니메이션을 위한 시간 증가 (극도로 느리게)
            if (isIdle) {
                idleTimeRef.current += 0.001; // 0.005에서 0.001로 극도로 감소 (거의 정지 수준)
            }

            // 스프링 포스 적용 (더 약하고 유연하게)
            connections.forEach(conn => {
                const node1 = newNodes.find(n => n.id === conn.from);
                const node2 = newNodes.find(n => n.id === conn.to);

                if (!node1 || !node2) return;

                const dx = node2.x - node1.x;
                const dy = node2.y - node1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance === 0) return;

                // 더 약한 스프링 포스와 유연한 거리 허용
                let targetDistance = conn.length;

                // Idle 상태에서는 타겟 거리에 부드러운 변화 추가 (극도로 작게)
                if (isIdle) {
                    const waveOffset = Math.sin(idleTimeRef.current + conn.from.length * 0.1) * 1; // 3에서 1로 감소
                    targetDistance += waveOffset;
                }

                const distanceError = distance - targetDistance;
                const force = distanceError * 0.008; // 0.015에서 0.008로 대폭 감소 (탄성 약화)

                // 거리 차이가 클 때만 강한 힘 적용
                const forceMultiplier = Math.min(1, Math.abs(distanceError) / 100);
                const adjustedForce = force * forceMultiplier;

                const fx = (dx / distance) * adjustedForce;
                const fy = (dy / distance) * adjustedForce;

                // 드래그 중인 노드가 아닐 때만 힘 적용
                if (!isDragging || !draggedNode || node1.id !== draggedNode.id) {
                    node1.vx += fx * 0.25; // 0.4에서 0.25로 감소 (탄성 약화)
                    node1.vy += fy * 0.25;
                }
                if (!isDragging || !draggedNode || node2.id !== draggedNode.id) {
                    node2.vx -= fx * 0.25; // 0.4에서 0.25로 감소 (탄성 약화)
                    node2.vy -= fy * 0.25;
                }
            });

            // Idle 상태에서 각 노드에 개별적인 부드러운 움직임 추가 (극도로 느리게)
            if (isIdle) {
                newNodes.forEach((node, index) => {
                    if (isDragging && draggedNode && node.id === draggedNode.id) return;

                    const timeOffset = idleTimeRef.current + index * 1.2;
                    const idleForceX = Math.sin(timeOffset * 0.8) * 0.005; // 0.02에서 0.005로 극도로 감소 (1/4)
                    const idleForceY = Math.cos(timeOffset * 0.6 + index) * 0.003; // 0.01에서 0.003로 극도로 감소 (1/3)

                    node.vx += idleForceX;
                    node.vy += idleForceY;
                });
            }

            // 노드 간 반발력 추가 (너무 가까워지지 않도록)
            newNodes.forEach((node1, i) => {
                newNodes.forEach((node2, j) => {
                    if (i >= j) return;
                    if (isDragging && draggedNode && (node1.id === draggedNode.id || node2.id === draggedNode.id)) return;

                    const dx = node2.x - node1.x;
                    const dy = node2.y - node1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 80 && distance > 0) {
                        const repelForce = (80 - distance) * 0.01; // 0.02에서 0.01로 감소
                        const fx = (dx / distance) * repelForce;
                        const fy = (dy / distance) * repelForce;

                        node1.vx -= fx;
                        node1.vy -= fy;
                        node2.vx += fx;
                        node2.vy += fy;
                    }
                });
            });

            // 드래그 중인 노드의 부드러운 이동 처리
            if (isDragging && draggedNode) {
                const draggedNodeData = newNodes.find(n => n.id === draggedNode.id);
                if (draggedNodeData) {
                    // 목표 위치로 부드럽게 이동 (딜레이 효과) - 더 느리게
                    const lerpFactor = 0.08; // 0.15에서 0.08로 감소
                    const dx = draggedNodeData.targetX - draggedNodeData.x;
                    const dy = draggedNodeData.targetY - draggedNodeData.y;
                    
                    draggedNodeData.x += dx * lerpFactor;
                    draggedNodeData.y += dy * lerpFactor;
                    // 드래그 중인 노드의 속도는 항상 0으로 유지
                    draggedNodeData.vx = 0;
                    draggedNodeData.vy = 0;
                }
            }

            // 드래그가 아닌 모든 노드의 속도와 위치 업데이트
            newNodes.forEach(node => {
                // 드래그 중인 노드는 위의 로직에서 처리했으므로 제외
                if (isDragging && draggedNode && node.id === draggedNode.id) {
                    return;
                }

                // 더 강한 감쇠로 유체같은 움직임 - 탄성 약화를 위해 감쇠 증가
                const dampingFactor = isIdle ? 0.98 : 0.93; // 0.90에서 0.93으로 증가 (더 빠른 정착)
                node.vx *= dampingFactor;
                node.vy *= dampingFactor;

                // 속도 제한 (너무 빠르게 움직이지 않도록)
                const maxVelocity = isIdle ? 0.8 : 8; // idle 상태 2에서 0.8로 대폭 감소
                const currentVelocity = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
                if (currentVelocity > maxVelocity) {
                    node.vx = (node.vx / currentVelocity) * maxVelocity;
                    node.vy = (node.vy / currentVelocity) * maxVelocity;
                }

                node.x += node.vx;
                node.y += node.vy;

                // 동적 경계 제한 (부드러운 바운스)
                if (node.x < minX) {
                    node.x = minX;
                    node.vx *= -0.3;
                }
                if (node.x > maxX) {
                    node.x = maxX;
                    node.vx *= -0.3;
                }
                if (node.y < minY) {
                    node.y = minY;
                    node.vy *= -0.3;
                }
                if (node.y > maxY) {
                    node.y = maxY;
                    node.vy *= -0.3;
                }
            });

            return newNodes;
        });
    }, [isDragging, draggedNode, connections, svgBounds]);

    useEffect(() => {
        let lastUpdate = Date.now();
        const targetFPS = 30;
        const frameInterval = 1000 / targetFPS;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - lastUpdate;

            if (elapsed >= frameInterval) {
                updatePhysics();
                lastUpdate = now - (elapsed % frameInterval);
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [updatePhysics]);

    // 마우스 다운 이벤트
    const handleMouseDown = (e: React.MouseEvent<SVGTextElement>, node: Node) => {
        e.preventDefault();
        lastInteractionRef.current = Date.now();
        
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // 먼저 클릭한 노드의 위치를 동기화
        setNodes(prevNodes => {
            return prevNodes.map(n => {
                if (n.id === node.id) {
                    return {
                        ...n,
                        x: n.x, // 현재 렌더링 위치 유지
                        y: n.y,
                        targetX: n.x, // target을 현재 위치로 동기화
                        targetY: n.y,
                        vx: 0,
                        vy: 0
                    };
                }
                return n;
            });
        });

        setIsDragging(true);
        setDraggedNode(node);
        setDragOffset({
            x: mouseX - node.x, // 현재 렌더링되는 실제 위치 기준으로 계산
            y: mouseY - node.y
        });
    };

    // 마우스 이동 이벤트
    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isDragging || !draggedNode || !svgRef.current) return;

        lastInteractionRef.current = Date.now();
        const rect = svgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const margin = 40; // 5에서 40으로 증가 (텍스트 보호)
        const newX = mouseX - dragOffset.x;
        const newY = mouseY - dragOffset.y;

        setNodes(prevNodes => {
            return prevNodes.map(node => {
                if (node.id === draggedNode.id) {
                    return {
                        ...node,
                        targetX: Math.max(margin, Math.min(svgBounds.width - margin, newX)),
                        targetY: Math.max(margin, Math.min(svgBounds.height - margin, newY)),
                        vx: 0,
                        vy: 0
                    };
                }
                return node;
            });
        });
    };

    // 마우스 업 이벤트 - 노드를 현재 위치에서 바로 멈춤
    const handleMouseUp = () => {
        lastInteractionRef.current = Date.now();
        
        // 드래그가 끝날 때 노드를 현재 위치에서 바로 멈춤
        if (isDragging && draggedNode) {
            setNodes(prevNodes => {
                return prevNodes.map(node => {
                    if (node.id === draggedNode.id) {
                        return {
                            ...node,
                            // 현재 위치에서 멈춤 (targetX/targetY로 이동하지 않음)
                            targetX: node.x, // 현재 위치를 target으로 설정
                            targetY: node.y, // 현재 위치를 target으로 설정
                            vx: 0,
                            vy: 0,
                            isRecentlyDragged: true, // 최근 드래그됨 표시
                            dragEndTime: Date.now() // 드래그 끝난 시간 기록
                        };
                    }
                    return node;
                });
            });
        }

        setIsDragging(false);
        setDraggedNode(null);
        setDragOffset({ x: 0, y: 0 });
    };

    // 터치 이벤트 (모바일 지원)
    const handleTouchStart = (e: React.TouchEvent<SVGTextElement>, node: Node) => {
        e.preventDefault();
        lastInteractionRef.current = Date.now();
        
        const touch = e.touches[0];
        if (!svgRef.current || !touch) return;
        
        const rect = svgRef.current.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;

        // 먼저 터치한 노드의 위치를 동기화
        setNodes(prevNodes => {
            return prevNodes.map(n => {
                if (n.id === node.id) {
                    return {
                        ...n,
                        x: n.x, // 현재 렌더링 위치 유지
                        y: n.y,
                        targetX: n.x, // target을 현재 위치로 동기화
                        targetY: n.y,
                        vx: 0,
                        vy: 0
                    };
                }
                return n;
            });
        });

        setIsDragging(true);
        setDraggedNode(node);
        setDragOffset({
            x: touchX - node.x, // 현재 렌더링되는 실제 위치 기준으로 계산
            y: touchY - node.y
        });
    };

    const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
        if (!isDragging || !draggedNode || !svgRef.current) return;
        e.preventDefault();

        lastInteractionRef.current = Date.now();
        const touch = e.touches[0];
        if (!touch) return;
        
        const rect = svgRef.current.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;

        const margin = 40; // 5에서 40으로 증가 (텍스트 보호)
        const newX = touchX - dragOffset.x;
        const newY = touchY - dragOffset.y;

        setNodes(prevNodes => {
            return prevNodes.map(node => {
                if (node.id === draggedNode.id) {
                    return {
                        ...node,
                        targetX: Math.max(margin, Math.min(svgBounds.width - margin, newX)),
                        targetY: Math.max(margin, Math.min(svgBounds.height - margin, newY)),
                        vx: 0,
                        vy: 0
                    };
                }
                return node;
            });
        });
    };

    const handleTouchEnd = () => {
        lastInteractionRef.current = Date.now();
        
        // 터치가 끝날 때도 노드를 현재 위치에서 바로 멈춤
        if (isDragging && draggedNode) {
            setNodes(prevNodes => {
                return prevNodes.map(node => {
                    if (node.id === draggedNode.id) {
                        return {
                            ...node,
                            // 현재 위치에서 멈춤 (targetX/targetY로 이동하지 않음)
                            targetX: node.x, // 현재 위치를 target으로 설정
                            targetY: node.y, // 현재 위치를 target으로 설정
                            vx: 0,
                            vy: 0,
                            isRecentlyDragged: true, // 최근 드래그됨 표시
                            dragEndTime: Date.now() // 드래그 끝난 시간 기록
                        };
                    }
                    return node;
                });
            });
        }

        setIsDragging(false);
        setDraggedNode(null);
        setDragOffset({ x: 0, y: 0 });
    };

    return (
        <div className="w-full h-full">
            <svg
                ref={svgRef}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* 연결선 렌더링 */}
                <g>
                    {connections.map((conn, index) => {
                        const node1 = nodes.find(n => n.id === conn.from);
                        const node2 = nodes.find(n => n.id === conn.to);

                        if (!node1 || !node2) return null;

                        return (
                            <line
                                key={index}
                                x1={node1.x}
                                y1={node1.y}
                                x2={node2.x}
                                y2={node2.y}
                                stroke="white"
                                strokeWidth="3"
                                opacity="0.4"
                                strokeLinecap="round"
                            />
                        );
                    })}
                </g>

                {/* 노드 렌더링 */}
                <g>
                    {nodes.map((node) => {
                        return (
                            <g
                                key={node.id}
                                transform={`translate(${node.x}, ${node.y})`}
                            >
                                {/* 노드 텍스트 - 클릭 가능하게 수정 */}
                                <text
                                    x="0"
                                    y="5"
                                    textAnchor="middle"
                                    className={`text-lg sm:text-4xl font-bold fill-white select-none transition-all duration-200 cursor-grab active:cursor-grabbing node-text ${draggedNode && draggedNode.id === node.id
                                            ? 'drop-shadow-2xl scale-110'
                                            : 'drop-shadow-lg'
                                        }`}
                                    onMouseDown={(e) => handleMouseDown(e, node)}
                                    onTouchStart={(e) => handleTouchStart(e, node)}
                                >
                                    {node.text}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
};

export default NodeGraph;