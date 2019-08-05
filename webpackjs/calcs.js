import React, { Component } from "react";
import { render } from "react-dom";

import CalcComponent from "./components/Calcs/CalcComponent";

const objectProps = {
  thermo60: {
    type: "Width,LinearFeet",
    heading: "60 mils thick (maintenance)",
    label: "Pounds of alkyd material",
    maxWidth: "12",
    maxFeet: "100",
    inputWidth: 0,
    inputLinearFeet: 0,
    divisor: 17.5609756097561,
    output: 0,
  },
  thermo90: {
    type: "Width,LinearFeet",
    heading: "90 mils thick (maintenance)",
    label: "Pounds of alkyd material",
    maxWidth: "12",
    maxFeet: "100",
    inputWidth: 0,
    inputLinearFeet: 0,
    divisor: 12.1951219512195,
    output: 0,
  },
  beadsExtruded: {
    type: "Width,LinearFeet",
    heading: "Beads - for extruded machine",
    label: "Pounds of beads",
    maxWidth: "12",
    maxFeet: "100",
    inputWidth: 0,
    inputLinearFeet: 0,
    divisor: 120,
    output: 0,
  },
  primer: {
    type: "Width,LinearFeet",
    heading: "Thermoplastic: Primer (sealant) - for extruded machine",
    label: "Gallons of primer",
    maxWidth: "12",
    maxFeet: "10000",
    inputWidth: 0,
    inputLinearFeet: 0,
    divisor: 3600,
    output: 0,
  },
  paintGallons: {
    type: "Width,LinearFeet,Thickness",
    heading: "Gallons Paint Used",
    label: "Gallons needed",
    maxWidth: "12",
    maxFeet: "10000",
    maxThickness: "15",
    inputWidth: 0,
    inputLinearFeet: 0,
    inputThickness: 0,
    divisor: 19250,
    output: 0,
  },
  beadsPaint: {
    type: "Width,LinearFeet",
    heading: "Beads (Pounds of beads)",
    label: "Pounds of beads",
    maxWidth: "12",
    maxFeet: "10000",
    inputWidth: 0,
    inputLinearFeet: 0,
    divisor: 212.4,
    output: 0,
  },
  adhesive: {
    type: "RPMS",
    heading: '4" RPMS',
    label: "Pounds of bituminous adhesive",
    maxRPMS: "100",
    inputRPMS: 0,
    divisor: 3,
    output: 0,
  }
}

class Calcs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      thermo60: objectProps.thermo60,
      thermo90: objectProps.thermo90,
      beadsExtruded: objectProps.beadsExtruded,
      primer: objectProps.primer,
      paintGallons: objectProps.paintGallons,
      beadsPaint: objectProps.beadsPaint,
      adhesive: objectProps.adhesive
    };
  }

  thermo60GetOutputWidth = () => {
    const inputWidth = event.target.value;
    const output = inputWidth*(this.state.thermo60.inputLinearFeet/objectProps.thermo60.divisor);
    this.setState({
      thermo60: {
        inputWidth: inputWidth,
        inputLinearFeet: this.state.thermo60.inputLinearFeet,
        output: output
      }
    })
  }

  thermo60GetOutputLinearFeet = () => {
    const inputLinearFeet = event.target.value;
    const output = this.state.thermo60.inputWidth*(inputLinearFeet/objectProps.thermo60.divisor);
    this.setState({
      thermo60: {
        inputWidth: this.state.thermo60.inputWidth,
        inputLinearFeet: inputLinearFeet,
        output: output
      }
    })
  }

  thermo90GetOutputWidth = () => {
    const inputWidth = event.target.value;
    const output = inputWidth*(this.state.thermo90.inputLinearFeet/objectProps.thermo90.divisor);
    this.setState({
      thermo90: {
        inputWidth: inputWidth,
        inputLinearFeet: this.state.thermo90.inputLinearFeet,
        output: output
      }
    })
  }

  thermo90GetOutputLinearFeet = () => {
    const inputLinearFeet = event.target.value;
    const output = this.state.thermo90.inputWidth*(inputLinearFeet/objectProps.thermo90.divisor);
    this.setState({
      thermo90: {
        inputWidth: this.state.thermo90.inputWidth,
        inputLinearFeet: inputLinearFeet,
        output: output
      }
    })
  }

  beadsExtrudedGetOutputWidth = () => {
    const inputWidth = event.target.value;
    const output = (this.state.beadsExtruded.inputLinearFeet/objectProps.beadsExtruded.divisor)*inputWidth;
    this.setState({
      beadsExtruded: {
        inputWidth: inputWidth,
        inputLinearFeet: this.state.beadsExtruded.inputLinearFeet,
        output: output
      }
    })
}

  beadsExtrudedGetOutputLinearFeet = () => {
      const inputLinearFeet = event.target.value;
      const output = (inputLinearFeet/objectProps.beadsExtruded.divisor)*this.state.beadsExtruded.inputWidth;
      this.setState({
        beadsExtruded: {
          inputWidth: this.state.beadsExtruded.inputWidth,
          inputLinearFeet: inputLinearFeet,
          output: output
        }
      })
  }

  primerGetOutputWidth = () => {
    const inputWidth = event.target.value;
    const output = inputWidth*(this.state.primer.inputLinearFeet/objectProps.primer.divisor);
    this.setState({
      primer: {
        inputWidth: inputWidth,
        inputLinearFeet: this.state.primer.inputLinearFeet,
        output: output
      }
    })
  }

  primerGetOutputLinearFeet = () => {
    const inputLinearFeet = event.target.value;
    const output = this.state.primer.inputWidth*(inputLinearFeet/objectProps.primer.divisor);
    this.setState({
      primer: {
        inputWidth: this.state.primer.inputWidth,
        inputLinearFeet: inputLinearFeet,
        output: output
      }
    })

  }

  paintGallonsGetOutputWidth = () => {
    const inputWidth = event.target.value;
    const output = (this.state.paintGallons.inputLinearFeet*inputWidth/objectProps.paintGallons.divisor)*this.state.paintGallons.inputThickness;
    this.setState({
      paintGallons: {
        inputWidth: inputWidth,
        inputLinearFeet: this.state.paintGallons.inputLinearFeet,
        inputThickness: this.state.paintGallons.inputThickness,
        output: output
      }
    })
  }

  paintGallonsGetOutputLinearFeet = () => {
    const inputLinearFeet = event.target.value;
    const output = (inputLinearFeet*this.state.paintGallons.inputWidth/objectProps.paintGallons.divisor)*this.state.paintGallons.inputThickness;
    this.setState({
      paintGallons: {
        inputWidth: this.state.paintGallons.inputWidth,
        inputLinearFeet: inputLinearFeet,
        inputThickness: this.state.paintGallons.inputThickness,
        output: output
      }
    })
  }

  paintGallonsGetOutputThickness = () => {
    const inputThickness = event.target.value;
    const output = (this.state.paintGallons.inputLinearFeet*this.state.paintGallons.inputWidth/objectProps.paintGallons.divisor)*inputThickness;
    this.setState({
      paintGallons: {
        inputWidth: this.state.paintGallons.inputWidth,
        inputLinearFeet: this.state.paintGallons.inputLinearFeet,
        inputThickness: inputThickness,
        output: output
      }
    })
  }

  beadsPaintGetOutputWidth = () => {
    const inputWidth = event.target.value;
    const output = (this.state.beadsPaint.inputLinearFeet/objectProps.beadsPaint.divisor)*inputWidth;
    this.setState({
      beadsPaint: {
        inputWidth: inputWidth,
        inputLinearFeet: this.state.beadsPaint.inputLinearFeet,
        output: output
      }
    })
  }

  beadsPaintGetOutputLinearFeet = () => {
    const inputLinearFeet = event.target.value;
    const output = (inputLinearFeet/objectProps.beadsPaint.divisor)*this.state.beadsPaint.inputWidth;
    this.setState({
      beadsPaint: {
        inputWidth: this.state.beadsPaint.inputWidth,
        inputLinearFeet: inputLinearFeet,
        output: output
      }
    })
  }

  adhesiveGetOutputRPMS = () => {
    const inputRPMS = event.target.value;
    const output = inputRPMS/objectProps.adhesive.divisor;
    this.setState({
      adhesive: {
        inputRPMS: inputRPMS,
        output: output
      }
    })
  }

  render() {
    return (
      <div>
        <h1 className="calc-header">Thermoplastic - extruded machine</h1>
        <CalcComponent
          objectProps={objectProps.thermo60}
          inputWidth={this.state.thermo60.inputWidth}
          inputLinearFeet={this.state.thermo60.inputLinearFeet}
          output={this.state.thermo60.output}
          getOutputWidth={this.thermo60GetOutputWidth}
          getOutputLinearFeet={this.thermo60GetOutputLinearFeet}
        />
        <CalcComponent
          objectProps={objectProps.thermo90}
          inputWidth={this.state.thermo90.inputWidth}
          inputLinearFeet={this.state.thermo90.inputLinearFeet}
          output={this.state.thermo90.output}
          getOutputWidth={this.thermo90GetOutputWidth}
          getOutputLinearFeet={this.thermo90GetOutputLinearFeet}
        />
        <CalcComponent
          objectProps={objectProps.beadsExtruded}
          inputWidth={this.state.beadsExtruded.inputWidth}
          inputLinearFeet={this.state.beadsExtruded.inputLinearFeet}
          output={this.state.beadsExtruded.output}
          getOutputWidth={this.beadsExtrudedGetOutputWidth}
          getOutputLinearFeet={this.beadsExtrudedGetOutputLinearFeet}
        />
        <CalcComponent
          objectProps={objectProps.primer}
          inputWidth={this.state.primer.inputWidth}
          inputLinearFeet={this.state.primer.inputLinearFeet}
          output={this.state.primer.output}
          getOutputWidth={this.primerGetOutputWidth}
          getOutputLinearFeet={this.primerGetOutputLinearFeet}
        />
        <h1 className="calc-header">Paint</h1>
        <CalcComponent
          objectProps={objectProps.paintGallons}
          inputWidth={this.state.paintGallons.inputWidth}
          inputLinearFeet={this.state.paintGallons.inputLinearFeet}
          inputThickness={this.state.paintGallons.inputThickness}
          output={this.state.paintGallons.output}
          getOutputWidth={this.paintGallonsGetOutputWidth}
          getOutputLinearFeet={this.paintGallonsGetOutputLinearFeet}
          getOutputThickness={this.paintGallonsGetOutputThickness}
        />
        <CalcComponent
          objectProps={objectProps.beadsPaint}
          inputWidth={this.state.beadsPaint.inputWidth}
          inputLinearFeet={this.state.beadsPaint.inputLinearFeet}
          output={this.state.beadsPaint.output}
          getOutputWidth={this.beadsPaintGetOutputWidth}
          getOutputLinearFeet={this.beadsPaintGetOutputLinearFeet}
        />
        <h1 className="calc-header">Bituminous adhesive</h1>
        <CalcComponent
          objectProps={objectProps.adhesive}
          inputRPMS={this.state.adhesive.inputRPMS}
          output={this.state.adhesive.output}
          getOutputRPMS={this.adhesiveGetOutputRPMS}
        />
      </div>
    );
  }
}

render(<Calcs />, document.getElementById("root-Calcs"));
