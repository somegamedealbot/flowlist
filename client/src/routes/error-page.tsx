import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
    const error : unknown = useRouteError()
    console.error(error)

    return (<div>
        <h1>Unexpected Error has Occured</h1>
            {
                isRouteErrorResponse(error) ? 
                (
                    <div>
                        <h2>{error.status}</h2>
                        <p>{error.statusText}</p>
                    </div>
                ) 
                :
                ''
            }
    </div>)
}