export const DEF_VISUAL_STYLE = [
  {
    selector: 'node',
    style: {
      'background-color': '#CCCCCC',
      'background-opacity': 0.9,
      'width': '20px',
      'height': '20px',
      'font-size': '0.5em',
      'text-halign': 'right',
      'text-valign': 'bottom',
      'label': 'data(name)',
      'font-family': 'Roboto, sans-serif'
    }
  },
  {
    selector: 'edge',
    style: {
      'line-color': '#aaaaaa',
      'width': 1,
      'label': 'data(interaction)',
      'font-size': '0.11em',
      'font-family': 'Roboto, sans-serif',
      'text-opacity': 0.3
    }
  },
  {
    selector: 'node:selected',
    style: {
      'background-color': 'orange'
    }
  },
  {
    selector: 'edge:selected',
    style: {
      'line-color': 'orange',
      'width': 6
    }
  }
];
