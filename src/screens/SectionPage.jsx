import './SectionPage.css'

export default function SectionPage({ title, description }) {
  return (
    <main className="section-shell">
      <section className="section-card">
        <p className="section-label">Module</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
    </main>
  )
}
