import { EditorProvider, FloatingMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'

import MenuBar from './MenuBar'
import './Tiptap.css'

// define your extension array
const extensions = [
    StarterKit,
    Placeholder.configure({
        placeholder: 'ʕ•̀ω•́ʔ✧ ~ ~ ~',
    }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({
        multicolor: true,
    }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
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
                editorProps={ onError!=null ? {attributes: { class: 'tiptap-error' }} : null}
            >
                {/* <BubbleMenu>This is the bubble menu</BubbleMenu> */}
                {/* <FloatingMenu>This is the floating menu</FloatingMenu> */}
            </EditorProvider>
        </div>
    )
}

export default Tiptap