import { useState } from 'react';
import { useCurrentEditor } from '@tiptap/react';

import Colors from '../../utils/colors';
import './MenuBar.css';

// TODO: add a leave-focus event handler to hide the dropdown menus when the user clicks outside of them

const MenuBar = () => {
    const { editor } = useCurrentEditor();
    const [isTextFormatMenuActive, setIsTextFormatMenuActive] = useState(false);
    const [isTextColorMenuActive, setIsTextColorMenuActive] = useState(false);
    const [isTextHighlightMenuActive, setIsTextHighlightMenuActive] = useState(false);
    const [isAssertMenuActive, setIsAssertMenuActive] = useState(false);
    const [isAlignMenuActive, setIsAlignMenuActive] = useState(false);
    const [dropdownMenuPosition, setDropdownMenuPosition] = useState({ left: 0, right: "unset" });

    // fix the dropdown menu position when it's out of the screen
    const handleDropdownMenuPosition = (event) => {
        // calculate the position of the dropdown btn to the right of the screen
        const button_to_right = window.innerWidth - event.target.getBoundingClientRect().right;
        if (button_to_right < 150) {
            setDropdownMenuPosition({ left: "unset", right: 0 });
        } else {
            setDropdownMenuPosition({ left: 0, right: "unset" });
        }
    }

    return (
        <div className="tiptap-toolbar">
            <div className='tool-block'>
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className={`ri-arrow-go-back-line`}
                    title='Undo'>
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className={`ri-arrow-go-forward-line`}
                    title='Redo'>
                </button>
            </div>

            <div className='divider'></div>
            {/* dropdown text format list */}
            <div className='dropdown-menu'>
                <div className='dropdown-btn' onClick={(e) => {setIsTextFormatMenuActive(!isTextFormatMenuActive); handleDropdownMenuPosition(e);}}>
                    <div className='dropdown-btn-horizontal-group'>
                        <i className='ri-menu-4-line dropdown-btn-icon'></i>
                        <span>&nbsp;&nbsp;style</span>
                    </div>
                    <i className={`${isTextFormatMenuActive ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                </div>
                {isTextFormatMenuActive && (
                    <div className='dropdown-list' style={{ left: dropdownMenuPosition.left, right: dropdownMenuPosition.right }}>
                        <div className={`dropdown-item ${editor.isActive('paragraph') ? 'active' : ''}`}
                            onClick={() => {editor.chain().focus().setParagraph().run(); setIsTextFormatMenuActive(false);}} 
                            title='Paragraph'>
                            <i className='ri-paragraph'></i>
                            <span>&nbsp;&nbsp;Paragraph</span>
                        </div>
                        <div className={`dropdown-item ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
                            onClick={() => {editor.chain().focus().setHeading({ level: 1 }).run(); setIsTextFormatMenuActive(false);}} 
                            title='Heading 1'>
                            <i className='ri-h-1'></i>
                            <span>&nbsp;&nbsp;Heading 1</span>
                        </div>
                        <div className={`dropdown-item ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
                            onClick={() => {editor.chain().focus().setHeading({ level: 2 }).run(); setIsTextFormatMenuActive(false);}} 
                            title='Heading 2'>
                            <i className='ri-h-2'></i>
                            <span>&nbsp;&nbsp;Heading 2</span>
                        </div>
                        <div className={`dropdown-item ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
                            onClick={() => {editor.chain().focus().setHeading({ level: 3 }).run(); setIsTextFormatMenuActive(false);}} 
                            title='Heading 3'>
                            <i className='ri-h-3'></i>
                            <span>&nbsp;&nbsp;Heading 3</span>
                        </div>
                        <div className={`dropdown-item ${editor.isActive('heading', { level: 4 }) ? 'active' : ''}`}
                            onClick={() => {editor.chain().focus().setHeading({ level: 4 }).run(); setIsTextFormatMenuActive(false);}} 
                            title='Heading 4'>
                            <i className='ri-h-4'></i>
                            <span>&nbsp;&nbsp;Heading 4</span>
                        </div>
                        <div className={`dropdown-item ${editor.isActive('codeBlock') ? 'active' : ''}`}
                            onClick={() => {editor.chain().focus().setCodeBlock().run(); setIsTextFormatMenuActive(false);}} 
                            title='Code Block'>
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
                    className={`ri-bold ${editor.isActive('bold') ? 'active' : ''}`}
                    title='Bold'>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`ri-italic ${editor.isActive('italic') ? 'active' : ''}`}
                    title='Italic'>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    disabled={!editor.can().chain().focus().toggleUnderline().run()}
                    className={`ri-underline ${editor.isActive('underline') ? 'active' : ''}`}
                    title='Underline'>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={`ri-strikethrough ${editor.isActive('strike') ? 'active' : ''}`}
                    title='Strikethrough'>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={!editor.can().chain().focus().toggleCode().run()}
                    className={`ri-code-view ${editor.isActive('code') ? 'active' : ''}`}
                    title='Code'>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`ri-double-quotes-r ${editor.isActive('blockquote') ? 'active' : ''}`}
                    title='Blockquote'>
                </button>
            </div>

            <div className='divider'></div>

            {/* dropdown text color grid */}
            <div className='dropdown-menu'>
                <div className='dropdown-btn' onClick={(e) => {setIsTextColorMenuActive(!isTextColorMenuActive); handleDropdownMenuPosition(e);}}>
                    <div className='dropdown-btn-horizontal-group'>
                        <i className='ri-font-color' style={{ color: editor.getAttributes('textStyle').color }}></i>
                    </div>
                    <i className={`${isTextColorMenuActive ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                </div>
                {isTextColorMenuActive && (
                    <div className='dropdown-grid' style={{ left: dropdownMenuPosition.left, right: dropdownMenuPosition.right }}>
                        {/* color unset button */}
                        <button
                            onClick={() => {editor.chain().focus().unsetColor().run(); setIsTextColorMenuActive(false);}}
                            style={{ background: "linear-gradient(225deg, rgba(255,255,255,1) 45%, rgba(251,63,63,1) 50%, rgba(255,255,255,1) 55%)" }}>
                        </button>
                        {/* color buttons */}
                        {Colors.map((color, index) => (
                            <button
                                key={index+1}
                                onClick={() => {editor.chain().focus().setColor(color.hexCode).run(); setIsTextColorMenuActive(false);}}
                                className={editor.isActive('textStyle', { color: color.hexCode }) ? 'active' : ''}
                                style={{ backgroundColor: color.hexCode }}>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* dropdown text highlight grid */}
            <div className='dropdown-menu'>
                <div className='dropdown-btn' onClick={(e) => {setIsTextHighlightMenuActive(!isTextHighlightMenuActive); handleDropdownMenuPosition(e);}}>
                    <div className='dropdown-btn-horizontal-group'>
                        <i className='ri-paint-fill' style={{ color: editor.getAttributes('highlight').color }}></i>
                    </div>
                    <i className={`${isTextHighlightMenuActive ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                </div>
                {isTextHighlightMenuActive && (
                    <div className='dropdown-grid' style={{ left: dropdownMenuPosition.left, right: dropdownMenuPosition.right }}>
                        {/* highlight unset button */}
                        <button
                            onClick={() => {editor.chain().focus().unsetHighlight().run(); setIsTextHighlightMenuActive(false);}}
                            // disabled={!editor.isActive('highlight')}
                            style={{ background: "linear-gradient(225deg, rgba(255,255,255,1) 45%, rgba(251,63,63,1) 50%, rgba(255,255,255,1) 55%)" }}>
                        </button>
                        {/* highlight color buttons */}
                        {Colors.map((color, index) => (
                            <button
                                key={index+1}
                                onClick={() => {editor.chain().focus().setHighlight({ color: color.hexCode }).run(); setIsTextHighlightMenuActive(false);}}
                                className={editor.isActive('highlight', { color: color.hexCode }) ? 'active' : ''}
                                style={{ backgroundColor: color.hexCode }}>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className='divider'></div>

            <div className='tool-block'>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`ri-list-unordered ${editor.isActive('bulletList') ? 'active' : ''}`}
                    title='Bullet List'
                ></button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`ri-list-ordered ${editor.isActive('orderedList') ? 'active' : ''}`}
                    title='Ordered List'
                ></button>
            </div>

            <div className='divider'></div>

            {/* dropdown insert list */}
            <div className='dropdown-menu'>
                <div className='dropdown-btn' onClick={(e) => {setIsAssertMenuActive(!isAssertMenuActive); handleDropdownMenuPosition(e);}}>
                    <div className='dropdown-btn-horizontal-group'>
                        <i className='ri-add-line dropdown-btn-icon'></i>
                        <span>&nbsp;&nbsp;assert</span>
                    </div>
                    <i className={`${isAssertMenuActive ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                </div>
                {isAssertMenuActive && (
                    <div className='dropdown-list' style={{ left: dropdownMenuPosition.left, right: dropdownMenuPosition.right }}>
                        <div className={`dropdown-item`}
                            onClick={() => {editor.chain().focus().setHardBreak().run(); setIsAssertMenuActive(false);}} 
                            title='Hard Break'>
                            <i className='ri-corner-down-left-line'></i>
                            <span>&nbsp;&nbsp;Hard Break</span>
                        </div>
                        <div className={`dropdown-item`}
                            onClick={() => {editor.chain().focus().setHorizontalRule().run(); setIsAssertMenuActive(false);}} 
                            title='Separator'>
                            <i className='ri-separator'></i>
                            <span>&nbsp;&nbsp;Separator</span>
                        </div>
                    </div>
                )}
            </div>

            <div className='divider'></div>

            {/* dropdown insert list */}
            <div className='dropdown-menu'>
                <div className='dropdown-btn' onClick={(e) => {setIsAlignMenuActive(!isAlignMenuActive); handleDropdownMenuPosition(e);}}>
                    <div className='dropdown-btn-horizontal-group'>
                        <i className='ri-align-justify dropdown-btn-icon'></i>
                        <span>&nbsp;&nbsp;align</span>
                    </div>
                    <i className={`${isAlignMenuActive ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                </div>
                {isAlignMenuActive && (
                    <div className='dropdown-list' style={{ left: dropdownMenuPosition.left, right: dropdownMenuPosition.right }}>
                        <div className={`dropdown-item ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
                            onClick={() => {editor.chain().focus().setTextAlign('left').run(); setIsAlignMenuActive(false);}}
                            title='Align Left'
                            >
                                <i className='ri-align-left'></i>
                                <span>&nbsp;&nbsp;Left Align</span>
                        </div>
                        <div className={`dropdown-item ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
                            onClick={() => {editor.chain().focus().setTextAlign('center').run(); setIsAlignMenuActive(false);}} 
                            title='Align Center'
                            >
                                <i className='ri-align-center'></i>
                                <span>&nbsp;&nbsp;Center Align</span>
                        </div>
                        <div className={`dropdown-item ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
                            onClick={() => {editor.chain().focus().setTextAlign('right').run(); setIsAlignMenuActive(false);}} 
                            title='Align Right'
                            >
                                <i className='ri-align-right'></i>
                                <span>&nbsp;&nbsp;Right Align</span>
                        </div>
                    </div>
                )}
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