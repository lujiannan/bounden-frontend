import { useState } from 'react'
import { EditorProvider, FloatingMenu, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'

import MenuBar from './MenuBar'
import './Tiptap.css'

// define your extension array
const extensions = [
    StarterKit,
    Placeholder.configure({
        placeholder: '  ʕ•̀ω•́ʔ✧ ~ ~ ~',
    }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({
        multicolor: true,
    }),
    TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
    }),
    Typography,
    Image.configure({
        allowBase64: true,
        HTMLAttributes: {
            class: 'tiptap-image'
        }
    }),
]

const Tiptap = ({ onContentChange, enableToolbar, enableEditable, initialContent, onError }) => {
    return (
        <div className="tiptap-container">
            <EditorProvider
                extensions={extensions}
                editable={enableEditable ? true : false}
                autofocus={false}
                content={initialContent}
                onUpdate={({ editor }) => {
                    onContentChange(editor);
                }}
                slotBefore={enableToolbar ? <MenuBar /> : null}
                // TODO: editorProps is not updating after initialization, need to fix it
                // add error affix to editor if there is an error
                editorProps={onError != false ? { attributes: { class: 'tiptap-error' } } : null}
            >
                {/* <BubbleMenu>This is the bubble menu</BubbleMenu> */}
                {/* <FloatingMenu
                    tippyOptions={{ duration: 300 }}
                    editor={useCurrentEditor()}
                >
                    <div className="floating-menu-container">
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={`ri-bold ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
                        ></button>
                    </div>
                </FloatingMenu> */}
            </EditorProvider>
        </div>
    )
}

export default Tiptap