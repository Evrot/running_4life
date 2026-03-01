import RunCard from './RunCard'

function RunList({ runs = [] }) {
  if (runs.length === 0) {
    return <p>No runs yet.</p>
  }

  return (
    <div style={{ display: 'grid', gap: '12px' }}>
      {runs.map(run => (
        <RunCard key={run.id} run={run} />
      ))}
    </div>
  )
}

export default RunList