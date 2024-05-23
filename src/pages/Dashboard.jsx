import ChartPieCCusto from '../components/ChartPieCCusto';
import ChartPieCargo from '../components/ChartPieCargo';
const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1> 
            <div style={{display: 'flex', gap: '30px'}}>
                <ChartPieCCusto />   
                <ChartPieCargo />   
            </div> 
                 
        </div>
    )

}

export default Dashboard;