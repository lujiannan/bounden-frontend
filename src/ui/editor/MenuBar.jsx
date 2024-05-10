import { useState } from 'react';
import { useCurrentEditor } from '@tiptap/react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'; // for getting the logged in user's email

import FullModal from '../modal/FullModal';
import Colors from '../../utils/colors';
import './MenuBar.css';

// TODO: add a leave-focus event handler to hide the dropdown menus when the user clicks outside of them

const MenuBar = () => {
    const URL_SUFFIX_IMAGE_UPLOAD = "/images/upload";
    const auth = useAuthUser();
    const user_email = auth.email;

    const { editor } = useCurrentEditor();
    const [isTextFormatMenuActive, setIsTextFormatMenuActive] = useState(false);
    const [isTextColorMenuActive, setIsTextColorMenuActive] = useState(false);
    const [isTextHighlightMenuActive, setIsTextHighlightMenuActive] = useState(false);
    const [isInsertMenuActive, setisInsertMenuActive] = useState(false);
    const [isAlignMenuActive, setIsAlignMenuActive] = useState(false);
    const [dropdownMenuPosition, setDropdownMenuPosition] = useState({ left: 0, right: "unset" });

    const [isImageUploadModalActive, setIsImageUploadModalActive] = useState(false);
    const [imageUploadModalTab, setImageUploadModalTab] = useState(0);
    const [imageURL, setImageURL] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(false);
    const [fetchError, setFetchError] = useState(null);

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

    const handleImageUpload = (event) => {
        setIsLoading(true);

        const file = event.target.files[0];

        // upload the image to the server, insert the image into the editor and show the upload status under the editor
        const form_data = new FormData();
        form_data.append("user_email", user_email);
        form_data.append("name", file.name);
        form_data.append("file", file);

        fetch(process.env.REACT_APP_SERVER_URL + URL_SUFFIX_IMAGE_UPLOAD, {
            method: "POST",
            headers: {
                // Content-Type is not required for FormData, cuz browser will set it automatically
                // "Content-Type": "application/form-data",
                // get access token from local storage
                "Authorization": "Bearer " + localStorage.getItem("_auth"),
            },
            body: form_data,
        })
            .then((res) => {
                if (!res.ok) { throw Error('Could not fetch the data for that resource...'); }
                console.log('Image Data posted');
                setIsLoading(false);
                setResult(true);
                setFetchError(null);
                return res.json();
            })
            .then((data) => {
                // do sth here after the image is uploaded
                console.log(data.message);
                if (data.message === "Image uploaded successfully") {
                    // set the image to the editor andclose the modal
                    editor.chain().focus().setImage({ src: data.url }).run();
                    setIsImageUploadModalActive(false);
                } else {
                    console.log(data.message);
                }
            })
            .catch(error => {
                setIsLoading(false);
                setResult(false);
                setFetchError(error.message);
                console.log(error.message)
                // alert(fetchError);
            });

        // set the image to the local image as a preview
        // editor.chain().focus().setImage({ src: URL.createObjectURL(file) }).run();
    }

    const handleImageURL = (e) => {
        e.preventDefault();
        editor.chain().focus().setImage({ src: imageURL }).run();
        setImageURL("");
        setIsImageUploadModalActive(false);
    }

    const handleImageUploadModalTabClick = (event) => {
        if (event.target.value === 0) {
            // image from website
            setImageUploadModalTab(0);
            document.getElementById("image-upload-modal-indicator").style.marginLeft = "0";
        } else if (event.target.value === 1) {
            // image upload
            setImageUploadModalTab(1);
            document.getElementById("image-upload-modal-indicator").style.marginLeft = "calc((100% - 3rem)/2)";
        }
    }

    return (
        <>
            {/* Modal for image upload */}
            <FullModal isOpen={isImageUploadModalActive} onClose={() => setIsImageUploadModalActive(false)}>
                <h1>Insert Image</h1>
                <ul className='image-upload-modal-tab-bar'>
                    <li value={0} onClick={(e) => { handleImageUploadModalTabClick(e) }} className='image-upload-modal-tab-item'>WEBSITE</li>
                    <li value={1} onClick={(e) => { handleImageUploadModalTabClick(e) }} className='image-upload-modal-tab-item'>UPLOAD</li>
                    <div className="image-upload-modal-indicator" id="image-upload-modal-indicator"></div>
                </ul>
                {/* website tab */}
                {imageUploadModalTab === 0 && (
                    <div className='image-upload-modal-url-container'>
                        <form onSubmit={handleImageURL}>
                            <input type="text" placeholder="Enter image URL" onChange={(e) => { setImageURL(e.target.value) }}/>
                            <button type="submit">Confirm</button>
                        </form>
                    </div>
                )}
                {/* image upload tab */}
                {imageUploadModalTab === 1 && (
                    <div className='image-upload-modal-container'>
                        {isLoading && (
                            <div className="image-upload-modal-loading-container">
                                <div className="loading-pulse"></div>
                            </div>
                        )}
                        {!isLoading && (
                            <>
                                <i className='ri-file-upload-line'></i>
                                <h3>Click (Drop) to Upload</h3>
                            </>
                        )}
                        <input type="file" accept="image/*" onChange={(event) => {
                            handleImageUpload(event);
                        }} />
                    </div>
                )}
            </FullModal>
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
                    <div className='dropdown-btn' onClick={(e) => { setIsTextFormatMenuActive(!isTextFormatMenuActive); handleDropdownMenuPosition(e); }}>
                        <div className='dropdown-btn-horizontal-group'>
                            <i className='ri-menu-4-line dropdown-btn-icon'></i>
                            <span>&nbsp;&nbsp;style</span>
                        </div>
                        <i className={`dropdown-btn-arrow ${isTextFormatMenuActive ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                    </div>
                    {isTextFormatMenuActive && (
                        <div className='dropdown-list' style={{ left: dropdownMenuPosition.left, right: dropdownMenuPosition.right }}>
                            <div className={`dropdown-item ${editor.isActive('paragraph') ? 'active' : ''}`}
                                onClick={() => { editor.chain().focus().setParagraph().run(); setIsTextFormatMenuActive(false); }}
                                title='Paragraph'>
                                <i className='ri-paragraph'></i>
                                <span>&nbsp;&nbsp;Paragraph</span>
                            </div>
                            <div className={`dropdown-item ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
                                onClick={() => { editor.chain().focus().setHeading({ level: 1 }).run(); setIsTextFormatMenuActive(false); }}
                                title='Heading 1'>
                                <i className='ri-h-1'></i>
                                <span>&nbsp;&nbsp;Heading 1</span>
                            </div>
                            <div className={`dropdown-item ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
                                onClick={() => { editor.chain().focus().setHeading({ level: 2 }).run(); setIsTextFormatMenuActive(false); }}
                                title='Heading 2'>
                                <i className='ri-h-2'></i>
                                <span>&nbsp;&nbsp;Heading 2</span>
                            </div>
                            <div className={`dropdown-item ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
                                onClick={() => { editor.chain().focus().setHeading({ level: 3 }).run(); setIsTextFormatMenuActive(false); }}
                                title='Heading 3'>
                                <i className='ri-h-3'></i>
                                <span>&nbsp;&nbsp;Heading 3</span>
                            </div>
                            <div className={`dropdown-item ${editor.isActive('heading', { level: 4 }) ? 'active' : ''}`}
                                onClick={() => { editor.chain().focus().setHeading({ level: 4 }).run(); setIsTextFormatMenuActive(false); }}
                                title='Heading 4'>
                                <i className='ri-h-4'></i>
                                <span>&nbsp;&nbsp;Heading 4</span>
                            </div>
                            <div className={`dropdown-item ${editor.isActive('codeBlock') ? 'active' : ''}`}
                                onClick={() => { editor.chain().focus().setCodeBlock().run(); setIsTextFormatMenuActive(false); }}
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
                    <div className='dropdown-btn' onClick={(e) => { setIsTextColorMenuActive(!isTextColorMenuActive); handleDropdownMenuPosition(e); }}>
                        <div className='dropdown-btn-horizontal-group'>
                            <i className='ri-font-color' style={{ color: editor.getAttributes('textStyle').color }}></i>
                        </div>
                        <i className={`dropdown-btn-arrow ${isTextColorMenuActive ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                    </div>
                    {isTextColorMenuActive && (
                        <div className='dropdown-grid' style={{ left: dropdownMenuPosition.left, right: dropdownMenuPosition.right }}>
                            {/* color unset button */}
                            <button
                                onClick={() => { editor.chain().focus().unsetColor().run(); setIsTextColorMenuActive(false); }}
                                style={{ background: "linear-gradient(225deg, rgba(255,255,255,1) 45%, rgba(251,63,63,1) 50%, rgba(255,255,255,1) 55%)" }}>
                            </button>
                            {/* color buttons */}
                            {Colors.map((color, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => { editor.chain().focus().setColor(color.hexCode).run(); setIsTextColorMenuActive(false); }}
                                    className={editor.isActive('textStyle', { color: color.hexCode }) ? 'active' : ''}
                                    style={{ backgroundColor: color.hexCode }}>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* dropdown text highlight grid */}
                <div className='dropdown-menu'>
                    <div className='dropdown-btn' onClick={(e) => { setIsTextHighlightMenuActive(!isTextHighlightMenuActive); handleDropdownMenuPosition(e); }}>
                        <div className='dropdown-btn-horizontal-group'>
                            <i className='ri-paint-fill' style={{ color: editor.getAttributes('highlight').color }}></i>
                        </div>
                        <i className={`dropdown-btn-arrow ${isTextHighlightMenuActive ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                    </div>
                    {isTextHighlightMenuActive && (
                        <div className='dropdown-grid' style={{ left: dropdownMenuPosition.left, right: dropdownMenuPosition.right }}>
                            {/* highlight unset button */}
                            <button
                                onClick={() => { editor.chain().focus().unsetHighlight().run(); setIsTextHighlightMenuActive(false); }}
                                // disabled={!editor.isActive('highlight')}
                                style={{ background: "linear-gradient(225deg, rgba(255,255,255,1) 45%, rgba(251,63,63,1) 50%, rgba(255,255,255,1) 55%)" }}>
                            </button>
                            {/* highlight color buttons */}
                            {Colors.map((color, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => { editor.chain().focus().setHighlight({ color: color.hexCode }).run(); setIsTextHighlightMenuActive(false); }}
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
                    <div className='dropdown-btn' onClick={(e) => { setisInsertMenuActive(!isInsertMenuActive); handleDropdownMenuPosition(e); }}>
                        <div className='dropdown-btn-horizontal-group'>
                            <i className='ri-function-add-line dropdown-btn-icon'></i>
                            <span className='dropdown-btn-text'>&nbsp;&nbsp;insert</span>
                        </div>
                        <i className={`dropdown-btn-arrow ${isInsertMenuActive ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                    </div>
                    {isInsertMenuActive && (
                        <div className='dropdown-list' style={{ left: dropdownMenuPosition.left, right: dropdownMenuPosition.right }}>
                            <div className={`dropdown-item`}
                                onClick={() => { editor.chain().focus().setHardBreak().run(); setisInsertMenuActive(false); }}
                                title='Hard Break'>
                                <i className='ri-corner-down-left-line'></i>
                                <span>&nbsp;&nbsp;Hard Break</span>
                            </div>
                            <div className={`dropdown-item`}
                                onClick={() => { editor.chain().focus().setHorizontalRule().run(); setisInsertMenuActive(false); }}
                                title='Separator'>
                                <i className='ri-separator'></i>
                                <span>&nbsp;&nbsp;Separator</span>
                            </div>
                            <div className={`dropdown-item`}
                                onClick={() => { setIsImageUploadModalActive(true); setisInsertMenuActive(false); }}
                                title='Image'>
                                <i className='ri-image-line'></i>
                                <span>&nbsp;&nbsp;Image</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className='divider'></div>

                {/* dropdown alignment list */}
                <div className='dropdown-menu'>
                    <div className='dropdown-btn' onClick={(e) => { setIsAlignMenuActive(!isAlignMenuActive); handleDropdownMenuPosition(e); }}>
                        <div className='dropdown-btn-horizontal-group'>
                            <i className='ri-align-justify dropdown-btn-icon'></i>
                            <span className='dropdown-btn-text'>&nbsp;&nbsp;align</span>
                        </div>
                        <i className={`dropdown-btn-arrow ${isAlignMenuActive ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                    </div>
                    {isAlignMenuActive && (
                        <div className='dropdown-list' style={{ left: dropdownMenuPosition.left, right: dropdownMenuPosition.right }}>
                            <div className={`dropdown-item ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
                                onClick={() => { editor.chain().focus().setTextAlign('left').run(); setIsAlignMenuActive(false); }}
                                title='Align Left'>
                                <i className='ri-align-left'></i>
                                <span>&nbsp;&nbsp;Left Align</span>
                            </div>
                            <div className={`dropdown-item ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
                                onClick={() => { editor.chain().focus().setTextAlign('center').run(); setIsAlignMenuActive(false); }}
                                title='Align Center'>
                                <i className='ri-align-center'></i>
                                <span>&nbsp;&nbsp;Center Align</span>
                            </div>
                            <div className={`dropdown-item ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
                                onClick={() => { editor.chain().focus().setTextAlign('right').run(); setIsAlignMenuActive(false); }}
                                title='Align Right'>
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
                        title='Mark Clear'>
                    </button>
                </div>
            </div>
        </>
    )
}

export default MenuBar;