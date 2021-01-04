import React from 'react';
import { NativeSelect, InputLabel, Switch, Slider } from '@material-ui/core';
import { ChromePicker } from 'react-color';


class LedControl extends React.Component {
  
  constructor() {
    super();

    this.state = {
      colorValue: {r: 255, g: 10, b: 10},
      style: "",
      kwargs: {
        red: 255,
        green: 10,
        blue: 10,
        brightness: 1,
        speed: 10,
        reverse: false,
        animation: "instant",
        animation_speed: 20,
        step: 1,
      },
      isLoading: true,
      error: null
    }

    this.effects = {
      "staticColor": {
        prettyName: "Static Color",
        speed: false,
        reverse: false,
        animation: true,
        rgb: true,
        brightness: true,
        animation_speed: true,
        step: false,
      },
      "rainbowCycle": {
        prettyName: "Rainbow Cycle",
        speed: true,
        reverse: true,
        animation: false,
        rgb: false,
        brightness: true,
        animation_speed: false,
        step: false,
      },
      "rainbowBreathing": {
        prettyName: "Rainbow Breathing",
        speed: true,
        reverse: true,
        animation: true,
        rgb: false,
        brightness: true,
        animation_speed: true,
        step: true,
      }
    }

    this.animations = {
      "instant": "Instant",
      "colorWipe": "Color Wipe",
      "colorWipeTwoSided": "Color Wipe Two Sided"
    }

    this.post = this.post.bind(this)
    this.changeStyle = this.changeStyle.bind(this)
    this.changeAnimation = this.changeAnimation.bind(this)
    this.changeBrightness = this.changeBrightness.bind(this)
    this.changeSpeed = this.changeSpeed.bind(this)
    this.changeAnimationSpeed = this.changeAnimationSpeed.bind(this)
    this.changeStep = this.changeStep.bind(this)
    this.changeReverse = this.changeReverse.bind(this)
    this.changeColor = this.changeColor.bind(this)
    this.handleChange = this.handleChange.bind(this)

  }

  async componentDidMount() {
    try {
      fetch('http://192.168.1.214:5000/get_lights')
        .then(res => res.json())
        .then(data => {
          console.log(data);
          this.setState({ style: data.style, kwargs: data.kwargs, isLoading: false },
            () => {
              this.state.colorValue = {r: this.state.kwargs.red, g: this.state.kwargs.green, b: this.state.kwargs.blue}
            });
        })
    } catch (error) {
      this.setState({ error: error.message, isLoading: false });
    }
  }

  changeStyle(event) {
    this.setState({
      style: event.target.value
    }, () => {
      this.post();
    });
  }

  changeAnimation(event) {
    this.setState({
      kwargs: { ...this.state.kwargs, animation: event.target.value}
    }, () => {
      this.post();
    });
  }

  changeBrightness(_, newValue) {
    this.setState({
      kwargs: { ...this.state.kwargs, brightness: newValue}
    }, () => {
      this.post();
    });
  }

  changeSpeed(_, newValue) {
    this.setState({
      kwargs: { ...this.state.kwargs, speed: newValue}
    }, () => {
      this.post();
    });
  }

  changeAnimationSpeed(_, newValue) {
    this.setState({
      kwargs: { ...this.state.kwargs, animation_speed: newValue}
    }, () => {
      this.post();
    });
  }

  changeStep(_, newValue) {
    this.setState({
      kwargs: { ...this.state.kwargs, step: newValue}
    }, () => {
      this.post();
    });
  }

  changeReverse(event) {
    this.setState({
      kwargs: { ...this.state.kwargs, reverse: event.target.checked}
    }, () => {
      this.post();
    });
  }

  changeColor(color) {
    this.setState({
      kwargs: { ...this.state.kwargs, red: color.rgb.r, green: color.rgb.g, blue: color.rgb.b}
    }, () => {
      this.post();
    });
  }

  handleChange(color) {
    this.setState({
      colorValue: color.rgb
    })
  }
  


  post() {
    fetch('http://192.168.1.214:5000/change_lights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        style: this.state.style,
        kwargs: this.state.kwargs,
      })
    }).then(response => {
      console.log(response)
  })
  }

  renderLed = () => {
    const { style, kwargs, isLoading, error } = this.state;

    if (error) {
      return <div>{error}</div>;
    }

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return  (
      <form>
        <div class="row row-space">
          <div class="col">
            <div class="input-group">
              <label class="label">Effect</label>
              <div class="w-100">
                <NativeSelect id="select1" value={style} onChange={this.changeStyle}>
                  {Object.keys(this.effects).map(effect =>
                  <option value={effect}>{this.effects[effect].prettyName}</option>
                  )}
                </NativeSelect>
              </div>
            </div>
          </div>
        </div>
        {(() => {
        if (this.effects[style].animation) {
          return (
            <div class="row row-space">
              <div class="col">
                <div class="input-group">
                  <label class="label">Animation</label>
                  <div class="w-100">
                    <NativeSelect id="select2" value={kwargs.animation} onChange={this.changeAnimation}>
                      {Object.keys(this.animations).map(animation =>
                      <option value={animation}>{this.animations[animation]}</option>
                      )}
                    </NativeSelect>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      })()}
      {(() => {
        if (this.effects[style].brightness) {
          return (
            <div class="row row-space">
              <div class="col">
                <div class="mb-1 input-group">
                  <label class="label">Brightness</label>
                  <div class="w-100">
                    <Slider
                      onChangeCommitted={this.changeBrightness}
                      defaultValue={kwargs.brightness}
                      aria-labelledby="brightness_slider"
                      step={0.01}
                      min={0}
                      max={1}
                      valueLabelDisplay="auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        }
      })()}
      {(() => {
        if (this.effects[style].rgb) {
          return (
            <div class="row row-space">
              <div class="col">
                <div class="input-group">
                  <label class="label">Color</label>
                  <div class="w-100">
                    <ChromePicker
                      color={ this.state.colorValue} 
                      onChange={ this.handleChange }
                      onChangeComplete={ this.changeColor }
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        }
      })()}
      {(() => {
        if (this.effects[style].speed) {
          return (
            <div class="row row-space">
              <div class="col">
                <div class="input-group">
                  <label class="label">Speed</label>
                  <div class="w-100">
                    <Slider
                      onChangeCommitted={this.changeSpeed}
                      defaultValue={kwargs.speed}
                      aria-labelledby="speed_slider"
                      step={1}
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        }
      })()}
      {(() => {
        if (this.effects[style].animation_speed && this.state.kwargs.animation != "instant") {
          return (
            <div class="row row-space">
              <div class="col">
                <div class="input-group">
                  <label class="label">Animation Speed</label>
                  <div class="w-100">
                    <Slider
                      onChangeCommitted={this.changeAnimationSpeed}
                      defaultValue={kwargs.animation_speed}
                      aria-labelledby="animation_speed_slider"
                      step={1}
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        }
      })()}
      {(() => {
        if (this.effects[style].step) {
          return (
            <div class="row row-space">
              <div class="col">
                <div class="input-group">
                  <label class="label">Step</label>
                  <div class="w-100">
                    <Slider
                      onChangeCommitted={this.changeStep}
                      defaultValue={kwargs.step}
                      aria-labelledby="step_slider"
                      step={1}
                      min={1}
                      max={100}
                      valueLabelDisplay="auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        }
      })()}
      {(() => {
        if (this.effects[style].reverse) {
          return (
            <div class="row row-space">
              <div class="col">
                <div class="input-group">
                  <label class="label">Reverse</label>
                  <div class="w-100">
                    <Switch
                      checked={kwargs.reverse}
                      onChange={this.changeReverse}
                      color="Primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        }
      })()}
      
      </form>
    );
  };
  
  render() {
    return <div>{this.renderLed()}</div>;
  }
  
}

export default LedControl;

