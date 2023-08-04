import { Link } from "react-router-dom"
export default function Test(){
    return(
        <>
            <div className="message">
                <Link to="/message">Message</Link>
            </div>
            <div className="call">
                <Link to="/call">Call</Link>
            </div>
            <h1>TEST TEST</h1>
        </>
    )
}