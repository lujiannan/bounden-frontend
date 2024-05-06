import { EditorProvider, FloatingMenu, BubbleMenu, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'

import MenuBar from './MenuBar'
import './Tiptap.css'

// define your extension array
const extensions = [
    StarterKit,
    Placeholder.configure({
        placeholder: 'ʕ•̀ω•́ʔ✧ ~ ~ ~',
    }),
    Underline,
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
                {/* <FloatingMenu>This is the floating menu</FloatingMenu> */}
                {/* <BubbleMenu>This is the bubble menu</BubbleMenu> */}
            </EditorProvider>
        </div>
    )
}

export default Tiptap