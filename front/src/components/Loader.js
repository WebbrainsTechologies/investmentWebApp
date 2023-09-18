import { CircularProgress } from "@mui/material";
import React from "react"

const Loader = () => {
    return <div>
        <div className="loaderdiv-outer">
            <div className="loaderbox">
                <CircularProgress />
            </div>
        </div>

    </div>
}

export default Loader;