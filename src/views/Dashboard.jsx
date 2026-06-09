import { Container, Card } from "react-bootstrap";

const Dashboard = () => {

    return (
        <Container>
            <br />
            <Card style={{ height: 600 }}>
                <iframe
                    title="estadisticas"
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/view?r=eyJrIjoiZTRjOTM0MzctMTAwYy00OTM5LTgzMjMtZjQ2YzllMDkyN2E5IiwidCI6ImU0NzY0NmZlLWRhMjctNDUxOC04NDM2LTVmOGIxNThiYTEyNyIsImMiOjR9"
                    allowFullScreen="true"
                ></iframe>
            </Card>
            <br />
            {/* DashBoard Ernesto Sevilla */}
            <Card style={{ height: 600 }}>
                <iframe
                    title="estadisticas"
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/view?r=eyJrIjoiZmI4ZTg2ZmYtZmEyNS00ODBiLTgzOTEtMDdiNDA1Y2JlZjA1IiwidCI6ImU0NzY0NmZlLWRhMjctNDUxOC04NDM2LTVmOGIxNThiYTEyNyIsImMiOjR9"
                    allowFullScreen="true"
                ></iframe>
            </Card>

            <br />
            {/* DashBoard 4 */}
            <Card style={{ height: 600 }}>
                <iframe
                    title="estadisticas"
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/view?r=eyJrIjoiNjU0YjA5NDQtY2Q4MC00NTgzLWI1ZjctOTI2YWFjODNkYTE0IiwidCI6ImU0NzY0NmZlLWRhMjctNDUxOC04NDM2LTVmOGIxNThiYTEyNyIsImMiOjR9"
                    allowFullScreen="true"
                ></iframe>
            </Card>
        </Container>
    );
};

export default Dashboard;