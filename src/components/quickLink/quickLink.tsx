import logo from "./link.svg";
import logo1 from "./quickLinkLogo/1.svg";
import logo2 from "./quickLinkLogo/2.svg";
import logo3 from "./quickLinkLogo/3.svg";
import logo4 from "./quickLinkLogo/4.svg";
import './quickLink.css';
import { IonButton, IonIcon } from "@ionic/react";

const QuickLink: React.FC = () =>{
    return(
        <div className="link">
            <div>
                <img className="logo-label" src={logo}/>
                <span>快捷链接</span>
            </div>
            <div className="logo"> 
                <img src={logo1}/>
                <img src={logo2}/>
                <img src={logo3}/>
                <img src={logo4}/>
            </div>
        </div>
    )
}


export default QuickLink;