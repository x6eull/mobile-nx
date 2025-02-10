import logo from "./link.svg";
import logo1 from "./quickLinkLogo/1.svg";
import logo2 from "./quickLinkLogo/2.svg";
import logo3 from "./quickLinkLogo/3.svg";
import logo4 from "./quickLinkLogo/4.svg";
import "./QuickLink.css";
import LinkAnimation from "./LinkAnimation";

const QuickLink: React.FC = () => {
  return (
    <div className="link">
      <div>
        <img className="logo-label" src={logo} />
        <span>快捷链接</span>
      </div>
      <div className="logo">
        {/**为了让动画演示完毕再跳转，用了ref和useEffect，而一个<a>标签需要一个独立的ref，为了避免大段重复，做成组件 */}
        <LinkAnimation href="http://baidu.com">
          <img src={logo1} />
        </LinkAnimation>
        <LinkAnimation href="http://baidu.com">
          <img src={logo2} />
        </LinkAnimation>
        <LinkAnimation href="http://baidu.com">
          <img src={logo3} />
        </LinkAnimation>
        <LinkAnimation href="http://baidu.com">
          <img src={logo4} />
        </LinkAnimation>
      </div>
    </div>
  );
};

export default QuickLink;
