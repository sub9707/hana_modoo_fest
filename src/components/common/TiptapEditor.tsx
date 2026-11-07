'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import { useCallback, useEffect } from 'react'
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import styles from './TiptapEditor.module.css'

interface TiptapEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  height?: string
}

export function TiptapEditor({
  value,
  onChange,
  placeholder = "내용을 입력하세요...",
  disabled = false,
  height = "300px"
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      TextStyle,
      Color,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  const addImage = useCallback(() => {
    const url = window.prompt('이미지 URL을 입력하세요:')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addLink = useCallback(() => {
    const url = window.prompt('링크 URL을 입력하세요:')
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  const setColor = useCallback((color: string) => {
    if (editor) {
      editor.chain().focus().setColor(color).run()
    }
  }, [editor])

  if (!editor) {
    return (
      <div
        className="border border-gray-300 rounded-lg bg-gray-100 animate-pulse"
        style={{ height }}
      />
    )
  }

  return (
    <div
      className={styles.editor}
      style={{ '--editor-height': height } as React.CSSProperties}
    >
      {/* 툴바 */}
      <div className={styles.toolbar}>
        {/* 텍스트 스타일 */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${styles.toolbarButton} ${editor.isActive('bold') ? styles.active : ''}`}
            disabled={disabled}
            title="굵게"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${styles.toolbarButton} ${editor.isActive('italic') ? styles.active : ''}`}
            disabled={disabled}
            title="기울임"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`${styles.toolbarButton} ${editor.isActive('underline') ? styles.active : ''}`}
            disabled={disabled}
            title="밑줄"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`${styles.toolbarButton} ${editor.isActive('strike') ? styles.active : ''}`}
            disabled={disabled}
            title="취소선"
          >
            <s>S</s>
          </button>
        </div>

        <div className={styles.toolbarDivider} />

        {/* 제목 */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`${styles.toolbarButton} ${editor.isActive('heading', { level: 1 }) ? styles.active : ''}`}
            disabled={disabled}
            title="제목 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`${styles.toolbarButton} ${editor.isActive('heading', { level: 2 }) ? styles.active : ''}`}
            disabled={disabled}
            title="제목 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`${styles.toolbarButton} ${editor.isActive('heading', { level: 3 }) ? styles.active : ''}`}
            disabled={disabled}
            title="제목 3"
          >
            H3
          </button>
        </div>

        <div className={styles.toolbarDivider} />

        {/* 정렬 */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'left' }) ? styles.active : ''}`}
            disabled={disabled}
            title="왼쪽 정렬"
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'center' }) ? styles.active : ''}`}
            disabled={disabled}
            title="가운데 정렬"
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'right' }) ? styles.active : ''}`}
            disabled={disabled}
            title="오른쪽 정렬"
          >
            <AlignRight size={16} />
          </button>
        </div>

        <div className={styles.toolbarDivider} />

        {/* 목록 */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${styles.toolbarButton} ${editor.isActive('bulletList') ? styles.active : ''}`}
            disabled={disabled}
            title="불릿 목록"
          >
            • 목록
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${styles.toolbarButton} ${editor.isActive('orderedList') ? styles.active : ''}`}
            disabled={disabled}
            title="번호 목록"
          >
            1. 목록
          </button>
        </div>

        <div className={styles.toolbarDivider} />

        <div className={styles.toolbarDivider} />

        {/* 색상 */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setColor('#000000')}
            className={styles.toolbarButton}
            disabled={disabled}
            title="검정색"
          >
            <span style={{ color: '#000000' }}>●</span>
          </button>
          <button
            type="button"
            onClick={() => setColor('#dc2626')}
            className={styles.toolbarButton}
            disabled={disabled}
            title="빨간색"
          >
            <span style={{ color: '#dc2626' }}>●</span>
          </button>
          <button
            type="button"
            onClick={() => setColor('#2563eb')}
            className={styles.toolbarButton}
            disabled={disabled}
            title="파란색"
          >
            <span style={{ color: '#2563eb' }}>●</span>
          </button>
          <button
            type="button"
            onClick={() => setColor('#16a34a')}
            className={styles.toolbarButton}
            disabled={disabled}
            title="초록색"
          >
            <span style={{ color: '#16a34a' }}>●</span>
          </button>
        </div>

        <div className={styles.toolbarDivider} />

        {/* 미디어 및 링크 */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={addLink}
            className={`${styles.toolbarButton} ${editor.isActive('link') ? styles.active : ''}`}
            disabled={disabled}
            title="링크 추가"
          >
            링크
          </button>
        </div>

        <div className={styles.toolbarDivider} />

        {/* 실행 취소/다시 실행 */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            className={styles.toolbarButton}
            disabled={!editor.can().undo() || disabled}
            title="실행 취소"
          >
            ↶ 실행취소
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            className={styles.toolbarButton}
            disabled={!editor.can().redo() || disabled}
            title="다시 실행"
          >
            ↷ 다시실행
          </button>
        </div>
      </div>

      {/* 에디터 콘텐츠 */}
      <div className={styles.editorContent} style={{ minHeight: height }}>
        <EditorContent editor={editor} />
        {!value && (
          <div className={styles.placeholder}>
            {placeholder}
          </div>
        )}
      </div>
    </div>
  )
}