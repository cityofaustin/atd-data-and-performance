import React from "react";

const CalcComponent = ({ objectProps, inputWidth, inputLinearFeet, inputThickness, inputRPMS, output, getOutputWidth, getOutputLinearFeet, getOutputThickness, getOutputRPMS }) => {
    return (
        <div>
            <div>
                <h4 className="calc-header">{objectProps.heading}</h4>
            </div>
            <div className="row calc-card">
                <div className="col-md-6">
                    {(objectProps.type === "Width,LinearFeet" || objectProps.type === "Width,LinearFeet,Thickness") && (
                    <div>
                        <div className="form-group">
                            <label htmlFor="width" className="calc-label-top">
                                Width (inches):
                            </label>
                            <br></br>
                            <div className="row">
                                <div className="col-md-8">
                                    <input
                                        type="range"
                                        max={objectProps.maxWidth}
                                        value={inputWidth}
                                        className="slider"
                                        onChange={getOutputWidth}
                                    >
                                    </input>
                                </div>
                                <div className="col-md-4">
                                    <input
                                        type="number"
                                        max={objectProps.maxWidth}
                                        value={inputWidth}
                                        className="form-control"
                                        onChange={getOutputWidth}
                                    >
                                    </input>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="linearFeet">
                                Linear feet:
                            </label>
                            <br></br>
                            <div className="row">
                                <div className="col-md-8">
                                    <input
                                        type="range"
                                        max={objectProps.maxFeet}
                                        value={inputLinearFeet}
                                        className="slider"
                                        onChange={getOutputLinearFeet}
                                    >
                                    </input>
                                </div>
                                <div className="col-md-4">
                                    <input
                                        type="number"
                                        max={objectProps.maxFeet}
                                        value={inputLinearFeet}
                                        className="form-control"
                                        onChange={getOutputLinearFeet}
                                    >
                                    </input>
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                    {objectProps.type === "Width,LinearFeet,Thickness" && (
                    <div className="form-group">
                        <label htmlFor="thickness">
                            Mil Thickness Desired:
                        </label>
                        <br></br>
                        <div className="row">
                            <div className="col-md-8">
                                <input
                                    type="range"
                                    max={objectProps.maxThickness}
                                    value={inputThickness}
                                    className="slider"
                                    onChange={getOutputThickness}
                                >
                                </input>
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="number"
                                    max={objectProps.maxThickness}
                                    value={inputThickness}
                                    className="form-control"
                                    onChange={getOutputThickness}
                                >
                                </input>
                            </div>
                        </div>
                    </div>
                    )}
                    {objectProps.type === "RPMS" && (
                    <div className="form-group">
                        <label htmlFor="RPMS">
                            RPMS:
                        </label>
                        <br></br>
                        <div className="row">
                            <div className="col-md-8">
                                <input
                                    type="range"
                                    max={objectProps.maxRPMS}
                                    value={inputRPMS}
                                    className="slider"
                                    onChange={getOutputRPMS}
                                >
                                </input>
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="number"
                                    max={objectProps.maxRPMS}
                                    value={inputRPMS}
                                    className="form-control"
                                    onChange={getOutputRPMS}
                                >
                                </input>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
                <div className="col-md-6">
                    <div className="row">
                        <label htmlFor="output" className="calc-label-top calc-label-output">{objectProps.label}:</label>
                    </div>
                    <div className="row">
                        <h5 className="calc-label-output">{output.toFixed(3)}</h5>
                    </div>
                </div>
                <br></br>
            </div>
        </div>           
    )
}

export default CalcComponent;