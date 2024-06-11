import WidgetList from "./WidgetList";
import "./Widgets.css"

function Widgets() {
    const URL_SUFFIX_WIDGETS = "/widgets"
    const TITLE_WIDGETS = "WIDGETS";

    return (
        <div className="widgets-container">
            <WidgetList urlSuffix={URL_SUFFIX_WIDGETS} titleString={TITLE_WIDGETS} />
            <div className="footer">
                <p>&copy; Bounden. All rights reserved.</p>
                <a href="https://beian.miit.gov.cn/" target="_blank">苏ICP备2024096881号</a>
            </div>
        </div>
    )
}

export default Widgets;