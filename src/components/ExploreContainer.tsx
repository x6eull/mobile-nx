import './ExploreContainer.css'

export default function ExploreContainer(props: { name: string }) {
  return (
    <div className="container">
      <strong>{props.name}</strong>
      <p>
        Explore{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://ionicframework.com/docs/components"
        >
          UI Components
        </a>
      </p>
    </div>
  )
}
