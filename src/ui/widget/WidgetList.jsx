import { useNavigate } from 'react-router-dom'

import './WidgetList.css'
import { WidgetsData } from "../../utils/widgetsData"

function WidgetList({ urlSuffix, titleString }) {
    const navigate = useNavigate();

    return (
        <div className='widgets-container'>
            <h1>{titleString}</h1>
            <div className='widget-grid-container'>
                {WidgetsData.map((widget, index) => {
                    return (
                        <div className='widget-grid-item' data-aos="fade" key={index} onClick={() => {navigate(urlSuffix + widget.url)}}>
                            <h1 className='widget-grid-item-title'>
                                <i className={widget.icon}></i>
                                &nbsp;&nbsp;{widget.title}
                            </h1>
                            <p className='widget-grid-item-description'>
                                {widget.description}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default WidgetList;