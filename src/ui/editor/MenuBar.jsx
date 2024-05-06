import { useState } from 'react';
import { useCurrentEditor } from '@tiptap/react';

import './MenuBar.css';

const MenuBar = () => {
    const { editor } = useCurrentEditor();
    const [isTextFormatMenuActive, setIsTextFormatMenuActive] = useState(false);
    const [isAssertMenuActive, setIsAssertMenuActive] = useState(false);

    const handleTextFormatSelected = (format) => {
        switch (format) {
            case "Paragraph":
                editor.chain().focus().setParagraph().run();
                break;
            case "Heading 1":
                editor.chain().focus().setHeading({ level: 1 }).run();
                break;
            case "Heading 2":
                editor.chain().focus().setHeading({ level: 2 }).run();
                break;
            case "Heading 3":
                editor.chain().focus().setHeading({ level: 3 }).run();
                break;
            case "Heading 4":
                editor.chain().focus().setHeading({ level: 4 }).run();
                break;
            case "Code Block":
                editor.chain().focus().setCodeBlock().run();
                break;
        }
        setIsTextFormatMenuActive(false);
    }

    const handleAssertMenuSelected = (format) => {
        switch (format) {
            case "Hard Break":
                editor.chain().focus().setHardBreak().run();
                break;
            case "Separator":
                editor.chain().focus().setHorizontalRule().run();
                break;
        }
        setIsAssertMenuActive(false);
    }

    return (
        <div className="tiptap-toolbar">
            <div className='tool-block'>
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className={`ri-arrow-go-back-line`}
                    title='Undo'
                ></button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className={`ri-arrow-go-forward-line`}
                    title='Redo'
                ></button>
            </div>

            <div className='divider'></div>
            {/* dropdown text format list */}
            <div className='dropdown-menu'>
                <div className='dropdown-btn' onClick={() => setIsTextFormatMenuActive(!isTextFormatMenuActive)}>
                    <div className='dropdown-btn-horizontal-group'>
                        <i className='ri-text dropdown-btn-icon'></i>
                        <span>&nbsp;&nbsp;style</span>
                    </div>
                    <i className={`${isTextFormatMenuActive ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                </div>
                {isTextFormatMenuActive && (
                    <div className='dropdown-list'>
                        <div className={`dropdown-item ${editor.isActive('paragraph') ? 'active' : ''}`}
                            onClick={() => handleTextFormatSelected("Paragraph")} title='Paragraph'>
                            <i className='ri-paragraph'></i>
                            <span>&nbsp;&nbsp;Paragraph</span>
                        </div>
                        <div className={`dropdown-item ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
                            onClick={() => handleTextFormatSelected("Heading 1")} title='Heading 1'>
                            <i className='ri-h-1'></i>
                            <span>&nbsp;&nbsp;Heading 1</span>
                        </div>
                        <div className={`dropdown-item ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
                            onClick={() => handleTextFormatSelected("Heading 2")} title='Heading 2'>
                            <i className='ri-h-2'></i>
                            <span>&nbsp;&nbsp;Heading 2</span>
                        </div>
                        <div className={`dropdown-item ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
                            onClick={() => handleTextFormatSelected("Heading 3")} title='Heading 3'>
                            <i className='ri-h-3'></i>
                            <span>&nbsp;&nbsp;Heading 3</span>
                        </div>
                        <div className={`dropdown-item ${editor.isActive('heading', { level: 4 }) ? 'active' : ''}`}
                            onClick={() => handleTextFormatSelected("Heading 4")} title='Heading 4'>
                            <i className='ri-h-4'></i>
                            <span>&nbsp;&nbsp;Heading 4</span>
                        </div>
                        <div className={`dropdown-item ${editor.isActive('codeBlock') ? 'active' : ''}`}
                            onClick={() => handleTextFormatSelected("Code Block")} title='Code Block'>
                            <i className='ri-code-block'></i>
                            <span>&nbsp;&nbsp;Code Block</span>
                        </div>
                    </div>
                )}
            </div>

            <div className='divider'></div>

            <div className='tool-block'>
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`ri-bold ${editor.isActive('bold') ? 'is-active' : ''}`}
                    title='Bold'
                ></button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`ri-italic ${editor.isActive('italic') ? 'is-active' : ''}`}
                    title='Italic'
                ></button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    disabled={!editor.can().chain().focus().toggleUnderline().run()}
                    className={`ri-underline ${editor.isActive('underline') ? 'is-active' : ''}`}
                    title='Underline'
                ></button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={`ri-strikethrough ${editor.isActive('strike') ? 'is-active' : ''}`}
                    title='Strikethrough'
                ></button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={!editor.can().chain().focus().toggleCode().run()}
                    className={`ri-code-view ${editor.isActive('code') ? 'is-active' : ''}`}
                    title='Code'
                ></button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`ri-double-quotes-r ${editor.isActive('blockquote') ? 'is-active' : ''}`}
                    title='Blockquote'
                ></button>
            </div>

            <div className='divider'></div>

            {/* dropdown text format list */}
            <div className='dropdown-menu'>
                <div className='dropdown-btn' onClick={() => setIsAssertMenuActive(!isAssertMenuActive)}>
                    <div className='dropdown-btn-horizontal-group'>
                        <i className='ri-add-line dropdown-btn-icon'></i>
                        <span>&nbsp;&nbsp;assert</span>
                    </div>
                    <i className={`${isAssertMenuActive ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                </div>
                {isAssertMenuActive && (
                    <div className='dropdown-list'>
                        <div className={`dropdown-item`}
                            onClick={() => handleAssertMenuSelected("Hard Break")} title='Hard Break'>
                            <i className='ri-corner-down-left-line'></i>
                            <span>&nbsp;&nbsp;Hard Break</span>
                        </div>
                        <div className={`dropdown-item`}
                            onClick={() => handleAssertMenuSelected("Separator")} title='Separator'>
                            <i className='ri-separator'></i>
                            <span>&nbsp;&nbsp;Separator</span>
                        </div>
                    </div>
                )}
            </div>

            <div className='divider'></div>

            <div className='tool-block'>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`ri-list-unordered ${editor.isActive('bulletList') ? 'is-active' : ''}`}
                    title='Bullet List'
                ></button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`ri-list-ordered ${editor.isActive('orderedList') ? 'is-active' : ''}`}
                    title='Ordered List'
                ></button>
            </div>

            <div className='divider'></div>

            <div className='tool-block'>
                <button
                    onClick={() => editor.chain().focus().unsetAllMarks().run()}
                    className='ri-format-clear'
                    title='Mark Clear'
                ></button>
            </div>
        </div>
    )
}

export default MenuBar;