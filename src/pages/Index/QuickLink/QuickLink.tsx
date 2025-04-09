import icon from './iconQuickLink.svg'
import logo1 from './icon/1.svg'
import logo2 from './icon/2.svg'
import logo3 from './icon/3.svg'
import logo4 from './icon/4.svg'
import logo5 from './icon/5.svg'
import logo6 from './icon/6.svg'
import logo7 from './icon/7.svg'
import './QuickLink.css'
import LinkAnimation from './LinkAnimation'
import Card, { IconImg } from '../Card/Card'

export default function QuickLink() {
  return (
    <Card
      logo={<IconImg bgColor="var(--link-icon-background)" src={icon} />}
      title="快捷链接"
      linkHref=""
      linkTitle=""
    >
      <div className="link">
        <div className="logo">
          {/**为了让动画演示完毕再跳转，用了ref和useEffect，而一个<a>标签需要一个独立的ref，为了避免大段重复，做成组件 */}
          <LinkAnimation href="http://baidu.com">
            <img src={logo1} alt="404" />
          </LinkAnimation>
          <LinkAnimation href="http://baidu.com">
            <img src={logo2} alt="404" />
          </LinkAnimation>
          <LinkAnimation href="http://baidu.com">
            <img src={logo3} alt="404" />
          </LinkAnimation>
          <LinkAnimation href="http://baidu.com">
            <img src={logo4} alt="404" />
          </LinkAnimation>
        </div>
        <div className="logo-more">
          <LinkAnimation href="http://baidu.com">
            <img src={logo5} alt="404" />
          </LinkAnimation>
          <LinkAnimation href="http://baidu.com">
            <img src={logo6} alt="404" />
          </LinkAnimation>
          <LinkAnimation href="http://baidu.com">
            <img src={logo7} alt="404" />
          </LinkAnimation>
        </div>
      </div>
    </Card>
  )
}
