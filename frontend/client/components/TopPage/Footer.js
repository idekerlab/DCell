import React, {Component} from 'react'
import style from './style.css'


class Footer extends Component {

  render() {
    return (
      <footer className={style.containerFooter}>
        <a href='http://www.cytoscape.org/' target='_blank'>
          &copy; 2016 University of California, San Diego Trey Ideker Lab
        </a>
      </footer>
    )
  }
}

export default Footer