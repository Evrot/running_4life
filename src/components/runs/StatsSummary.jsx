import Card from '../ui/Card'

function StatsSummary({ summary }) {
  return (
    <Card>
      <h3>Weekly Summary</h3>
      <p>Total Runs: {summary?.totalRuns ?? 0}</p>
      <p>Total Distance: {summary?.totalDistance ?? 0} mi</p>
      <p>Average Pace: {summary?.avgPace ?? '--'}</p>
    </Card>
  )
}

export default StatsSummary