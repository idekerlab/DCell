import React from "react"
import cytoscape from "cytoscape"
import style from './style.css'

// Original position will be used when layout is positions are available
const DEF_LAYOUT = 'preset'
const LAYOUT = 'cose'


const CY_EVENTS = {
  select: "select",
  unselect: 'unselect',
  add: 'add',
  remove: 'remove'
}


export default class CytoscapeRenderer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      rendered: false,
      vs: 'default',
    }
  }


  updateCyjs(networkData) {
    if(networkData === undefined || networkData === null) {
      return;
    }

    this.state.rendered = true
    let network = networkData.toJS()

    // Case 1: network has Style section
    let visualStyle = network.style
    let layoutFlag = false

    if (visualStyle === undefined || visualStyle === null || visualStyle === {}) {

      if(visualStyle === null) {
        layoutFlag = true
      }
      // Style section is not available
      const styleName = this.props.currentVs.get('vsName')
      visualStyle = this.props.styles.get(styleName)
      if(visualStyle === undefined) {
        visualStyle = this.props.styles.get('default')
      }
    } else {
      // This is a new visual style.  Add it to the manager.
      this.props.vsActions.addStyle('Custom', visualStyle)
      this.props.currentVsActions.setCurrentVs('Custom')
    }


    const cy = this.state.cyjs
    cy.style(visualStyle)
    cy.add(network.elements.nodes)
    cy.add(network.elements.edges)
    if(layoutFlag) {
      cy.layout({ name: LAYOUT })
    }
    cy.fit()
  }

  componentDidMount() {
    // Create Cytoscape.js instance here, only once!
    const cy = cytoscape(
      Object.assign(
        {
          container: document.getElementById(this.props.rendId),
          elements: [],
          layout: {
            name: DEF_LAYOUT
          }
        }))
    this.setEventListener(cy)
    this.state.cyjs = cy
  }


  shouldComponentUpdate(nextProps, nextState) {
    // React is responsible only for the root Cytoscape tag.
    // and in this section, the only thing we need to check is background and network.
    console.log("$$$$$$$$$ Checking props")
    if(!this.state.rendered) {
      console.log("$$$$$$$$$ NEED rendering")
      this.updateCyjs(this.props.networkData)
      return true
    }

    if (nextProps.networkData === this.props.networkData) {
      // Is this background update?
      if(nextProps.backgroundColor === this.props.backgroundColor) {
        return false
      } else {
        return true
      }
    }
    return true
  }

  componentWillReceiveProps(nextProps) {
    const command = nextProps.commands.command
    if(command !== '') {
      const cy = this.state.cyjs
      if(command === 'fit') {
        cy.fit()
      }
      else if(command === 'zoomIn') {
        cy.zoom(cy.zoom() * 1.2)
      }
      else if(command === 'zoomOut') {
        cy.zoom(cy.zoom() * 0.8)
      }
      this.props.commandActions.reset()
      return
    }

    // Style
    const curVs = this.state.vs
    const nextVs = nextProps.currentVs.get('vsName')
    if(curVs !== nextVs) {
      const vs = this.props.styles.get(nextVs)
      this.state.cyjs.style(vs)
      this.setState({
        vs: nextVs
      })

      return;
    }


    if (nextProps === undefined || nextProps.networkData === undefined) {
      console.log("=========== NO DATA");
      return
    }

    if (nextProps.networkData === this.props.networkData
      && this.state.rendered === true) {
      return
    }
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    console.log(this.state.rendered)
    if(!this.state.rendered) {
      this.updateCyjs(nextProps.networkData)
    }
  }


  setEventListener(cy) {
    cy.on('data select unselect add remove', ev => {
      switch (ev.originalEvent.type) {
        case CY_EVENTS.select:
          let selected = ev.cyTarget;
          this.props.eventActions.selected(selected.data())
          break
        case CY_EVENTS.unselect:
          let unselected = ev.cyTarget;
          this.props.eventActions.unselected(unselected.data())
          break
        default:
          break
      }
    })
  }


  render() {
    const bgc = this.props.backgroundColor.get('backgroundColor')

    // Just add a div tag for Cytoscape.js.
    // Cytoscape.js can render result only when this section is available in DOM.
    return (
      <div
        id={this.props.rendId}
        className={style.cy}
        style={{backgroundColor: bgc}}
      />
    )
  }
}
