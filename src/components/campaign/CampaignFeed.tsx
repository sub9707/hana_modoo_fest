'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share2, MoreHorizontal, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface CampaignPost {
  id: string
  type: 'hashtag' | 'photo' | 'story'
  content: string
  images?: string[]
  hashtags: string[]
  author: {
    nickname: string
    isAnonymous: boolean
  }
  createdAt: string
  likes: number
  isApproved: boolean
  moderationStatus: 'pending' | 'approved' | 'rejected'
}

interface CampaignFeedProps {
  posts: CampaignPost[]
  onLoadMore?: () => void
  hasMore?: boolean
}

export default function CampaignFeed({ posts, onLoadMore, hasMore = false }: CampaignFeedProps) {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return '방금 전'
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`
    return `${Math.floor(diffInMinutes / 1440)}일 전`
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      hashtag: '해시태그',
      photo: '포토',
      story: '스토리'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getTypeColor = (type: string) => {
    const colors = {
      hashtag: 'bg-blue-100 text-blue-700',
      photo: 'bg-green-100 text-green-700',
      story: 'bg-purple-100 text-purple-700'
    }
    return colors[type as keyof typeof colors] || 'bg-muted text-muted-foreground'
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardContent className="p-6">
            {/* 포스트 헤더 */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {post.author.isAnonymous ? '익명' : post.author.nickname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-foreground">
                      {post.author.isAnonymous ? '익명 사용자' : post.author.nickname}
                    </p>
                    <Badge className={getTypeColor(post.type)}>
                      {getTypeLabel(post.type)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatTimeAgo(post.createdAt)}
                  </p>
                </div>
              </div>
              
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* 포스트 콘텐츠 */}
            <div className="mb-4">
              <p className="text-foreground leading-relaxed mb-3">
                {post.content}
              </p>
              
              {/* 해시태그 */}
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.hashtags.map((hashtag, index) => (
                    <span key={index} className="text-primary text-sm font-medium">
                      #{hashtag}
                    </span>
                  ))}
                </div>
              )}

              {/* 이미지 */}
              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {post.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <span className="text-4xl">📸</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 포스트 액션 */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={`space-x-1 ${likedPosts.has(post.id) ? 'text-red-500' : ''}`}
                >
                  <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                  <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>댓글</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="space-x-1">
                  <Share2 className="w-4 h-4" />
                  <span>공유</span>
                </Button>
              </div>
              
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* 더보기 버튼 */}
      {hasMore && (
        <div className="text-center">
          <Button onClick={onLoadMore} variant="outline" className="px-8">
            더 많은 게시물 보기
          </Button>
        </div>
      )}
    </div>
  )
}