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
    output: 0,
  },
  adhesive: {
    type: "RPMS",
    heading: '4" RPMS',
    label: "Pounds of bituminous adhesive",
    maxRPMS: "100",
    inputRPMS: 0,
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
    this.thermo60GetOutputWidth = this.thermo60GetOutputWidth.bind(this);
    this.thermo60getOutputLinearFeet = this.thermo60getOutputLinearFeet.bind(this);
    this.thermo90GetOutputWidth = this.thermo90GetOutputWidth.bind(this);
    this.thermo90getOutputLinearFeet = this.thermo90getOutputLinearFeet.bind(this);
    this.beadsExtrudedGetOutputWidth = this.beadsExtrudedGetOutputWidth.bind(this);
    this.beadsExtrudedGetOutputLinearFeet = this.beadsExtrudedGetOutputLinearFeet.bind(this);
    this.primerGetOutputWidth = this.primerGetOutputWidth.bind(this);
    this.primerGetOutputLinearFeet = this.primerGetOutputLinearFeet.bind(this);
    this.paintGallonsGetOutputWidth = this.paintGallonsGetOutputWidth.bind(this);
    this.paintGallonsGetOutputLinearFeet = this.paintGallonsGetOutputLinearFeet.bind(this);
    this.paintGallonsGetOutputThickness = this.paintGallonsGetOutputThickness.bind(this);
    this.beadsPaintGetOutputWidth = this.beadsPaintGetOutputWidth.bind(this);
    this.beadsPaintGetOutputLinearFeet = this.beadsPaintGetOutputLinearFeet.bind(this);
    this.adhesiveGetOutputRPMS = this.adhesiveGetOutputRPMS.bind(this);
  }

  thermo60GetOutputWidth() {
    const inputWidth = event.target.value;
    const output = inputWidth*(this.state.thermo60.inputLinearFeet/17.5609756097561);
    this.setState({
      thermo60: {
        inputWidth: inputWidth,
        inputLinearFeet: this.state.thermo60.inputLinearFeet,
        output: output
      }
    })
  }

  thermo60getOutputLinearFeet() {
    const inputLinearFeet = event.target.value;
    const output = this.state.thermo60.inputWidth*(inputLinearFeet/17.5609756097561);
    this.setState({
      thermo60: {
        inputWidth: this.state.thermo60.inputWidth,
        inputLinearFeet: inputLinearFeet,
        output: output
      }
    })
  }

  thermo90GetOutputWidth() {
    const inputWidth = event.target.value;
    const output = inputWidth*(this.state.thermo90.inputLinearFeet/12.1951219512195);
    this.setState({
      thermo90: {
        inputWidth: inputWidth,
        inputLinearFeet: this.state.thermo90.inputLinearFeet,
        output: output
      }
    })
  }

  thermo90getOutputLinearFeet() {
    const inputLinearFeet = event.target.value;
    const output = this.state.thermo90.inputWidth*(inputLinearFeet/12.1951219512195);
    this.setState({
      thermo90: {
        inputWidth: this.state.thermo90.inputWidth,
        inputLinearFeet: inputLinearFeet,
        output: output
      }
    })
  }

  beadsExtrudedGetOutputWidth() {
    const inputWidth = event.target.value;
    const output = (this.state.beadsExtruded.inputLinearFeet/120)*inputWidth;
    this.setState({
      beadsExtruded: {
        inputWidth: inputWidth,
        inputLinearFeet: this.state.beadsExtruded.inputLinearFeet,
        output: output
      }
    })
}

  beadsExtrudedGetOutputLinearFeet() {
      const inputLinearFeet = event.target.value;
      const output = (inputLinearFeet/120)*this.state.beadsExtruded.inputWidth;
      this.setState({
        beadsExtruded: {
          inputWidth: this.state.beadsExtruded.inputWidth,
          inputLinearFeet: inputLinearFeet,
          output: output
        }
      })
  }

  primerGetOutputWidth() {
    const inputWidth = event.target.value;
    const output = inputWidth*(this.state.primer.inputLinearFeet/3600);
    this.setState({
      primer: {
        inputWidth: inputWidth,
        inputLinearFeet: this.state.primer.inputLinearFeet,
        output: output
      }
    })
  }

  primerGetOutputLinearFeet() {
    const inputLinearFeet = event.target.value;
    const output = this.state.primer.inputWidth*(inputLinearFeet/3600);
    this.setState({
      primer: {
        inputWidth: this.state.primer.inputWidth,
        inputLinearFeet: inputLinearFeet,
        output: output
      }
    })

  }

  paintGallonsGetOutputWidth() {
    const inputWidth = event.target.value;
    const output = (this.state.paintGallons.inputLinearFeet*inputWidth/19250)*this.state.paintGallons.inputThickness;
    this.setState({
      paintGallons: {
        inputWidth: inputWidth,
        inputLinearFeet: this.state.paintGallons.inputLinearFeet,
        inputThickness: this.state.paintGallons.inputThickness,
        output: output
      }
    })
  }

  paintGallonsGetOutputLinearFeet() {
    const inputLinearFeet = event.target.value;
    const output = (inputLinearFeet*this.state.paintGallons.inputWidth/19250)*this.state.paintGallons.inputThickness;
    this.setState({
      paintGallons: {
        inputWidth: this.state.paintGallons.inputWidth,
        inputLinearFeet: inputLinearFeet,
        inputThickness: this.state.paintGallons.inputThickness,
        output: output
      }
    })
  }

  paintGallonsGetOutputThickness() {
    const inputThickness = event.target.value;
    const output = (this.state.paintGallons.inputLinearFeet*this.state.paintGallons.inputWidth/19250)*inputThickness;
    this.setState({
      paintGallons: {
        inputWidth: this.state.paintGallons.inputWidth,
        inputLinearFeet: this.state.paintGallons.inputLinearFeet,
        inputThickness: inputThickness,
        output: output
      }
    })
  }

  beadsPaintGetOutputWidth() {
    const inputWidth = event.target.value;
    const output = (this.state.beadsPaint.inputLinearFeet/212.4)*inputWidth;
    this.setState({
      beadsPaint: {
        inputWidth: inputWidth,
        inputLinearFeet: this.state.beadsPaint.inputLinearFeet,
        output: output
      }
    })
  }

  beadsPaintGetOutputLinearFeet() {
    const inputLinearFeet = event.target.value;
    const output = (inputLinearFeet/212.4)*this.state.beadsPaint.inputWidth;
    this.setState({
      beadsPaint: {
        inputWidth: this.state.beadsPaint.inputWidth,
        inputLinearFeet: inputLinearFeet,
        output: output
      }
    })
  }

  adhesiveGetOutputRPMS() {
    const inputRPMS = event.target.value;
    const output = inputRPMS*(55/165);
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
          getOutputLinearFeet={this.thermo60getOutputLinearFeet}
        />
        <CalcComponent
          objectProps={objectProps.thermo90}
          inputWidth={this.state.thermo90.inputWidth}
          inputLinearFeet={this.state.thermo90.inputLinearFeet}
          output={this.state.thermo90.output}
          getOutputWidth={this.thermo90GetOutputWidth}
          getOutputLinearFeet={this.thermo90getOutputLinearFeet}
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
