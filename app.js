/*
Sorting can be through Points , Groups, Last Activity
*/


import React, { Component } from "react";
import axios from "axios";
import FontAwesome from "react-fontawesome";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = { items: [], id:0 };
    this.pointLabel = this.point;

    this.sortColumnName = '';

    this.sortOrder = true;
    this.infoLabel = 'Info';
    this.pointLabel = 'Point';
    this.lastActiveLabel = 'Last Active';
  }



  render() {
    return (
      <table className="table">
        <thead>{this.generateHeader()}</thead>
        <tbody>{this.generateRow()}</tbody>
      </table>
    )
  }

  generateHeader() {
    return (
      <tr>
        <th><input type="checkbox" name="" value="" /></th>
        <th>Info</th>
        <th onClick={() => this.sortColumn('point')} >{this.pointLabel}</th>
        <th onClick={() => this.sortColumn('UserGroup')}>User Group</th>
        <th>Last Active</th>
        <th></th>
      </tr>
    );
  }

  generateRow() {
    let dataRow = this.state.items;
    let key = this.state.id;
    if (dataRow.length === 0) {
      return (
        <tr>
          <td colSpan="6">No Record Found</td>
        </tr>
      );
    } else {
      return dataRow.map((item,i) => {
        return (<TableRow data={item} id={i} />)
      });
    }
  }


  sortColumn(column) {
    if(column === this.sortColumnName) {
      this.sortOrder = !this.sortOrder;
    } else {
      this.sortColumnName = column;
      this.sortOrder = true;
    }
    this.renderLabels(column);
    let sortItems = this.state.items;
    console.log(sortItems);
    let a, b;
    sortItems.sort(function(a,b){
      return a.value - b.value;
    });
    // if(this.sortOrder === true){
    //   a = -1;
    //   b = 1;
    // }else{
    //   a = 1;
    //   b = -1;
    // }
    // console.log(a);
    // sortItems.sort((first,second,column)=>{
    //   if(a[column] < b[column]){
    //     return a;
    //   }
    //   if(a[column] < b[column]){
    //     return a;
    //   }
    // })
    this.setState({
      items: sortItems
    })
    console.log(this.state.items)
  }

  renderLabels(column){
    let orderClass;
    if(this.sortOrder === true){
      orderClass = 'caret-up';
    }else{
      orderClass = "caret-down";
    }
    switch(column){
      case 'name':
      this.infoLabel = (
        <span>Info<FontAwesome name="caret-up" className={orderClass} /></span>
      );
      this.pointLabel = 'Points';
      this.lastActiveLabel = 'Last Active';
      break;
    case 'point':
      this.pointLabel = (
        <span>Points<FontAwesome name={orderClass} /></span>
      );
      this.infoLabel = 'Points';
      this.lastActiveLabel = 'Last Active';
      break;
    case 'lastActive':
      this.lastActiveLabel = (
        <span>Last Active<FontAwesome name={orderClass} /></span>
      );
      this.pointLabel = 'Points';
      this.infoLabel = 'Last Active';
      break;
    }
  }

  componentDidMount() {
    axios
      .get("http://faisaljanjua.com/t.json")
      .then(res => {
        this.setState({ items: res.data });
      })
      .catch(function(er) {
        console.log(er);
      });
  }

}

class TableRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showIcons: false
    }
    console.log(props);
    this.data = this.props.data;
    this.avat = this.data.avatarUrl;
    this.info = this.renderInfo();
    this.name = this.data.name;
    this.email = this.data.email;
    this.point = this.renderPoint();
    this.userGroup = this.renderUserGroup();
    this.lastActive = this.renderActivity();

    this.showIcon = this.showIcons.bind(this);
    this.hideIcon = this.hideIcons.bind(this);
    this.renderIcon = this.renderIcons();
  }

  renderInfo() {
    let avt = this.data.avatarUrl;
    return (
      <div className="info">
        <div className="img">
          <img src={require(`./img/${avt}`)} width="60" />
        </div>
        <div>
          <span className="name">{this.data.name}</span>
          <span>{this.data.email}</span>
        </div>
      </div>
    );
  }

  renderPoint() {
    if (this.data.hasOwnProperty("point")) {
      return (
        <span>
          <FontAwesome className="point" name="star-o" />
          {this.data.point}
        </span>
      );
    }
  }

  renderUserGroup() {
    if (
      this.data.hasOwnProperty("userGroup") &&
      this.data.userGroup.length > 0
    ) {
      // console.log(this.data.userGroup);
      return this.data.userGroup.map((grp) => {
        return (<span className="grp">{grp}</span>)
      });
    }
  }

  renderActivity(){
    let date = new Date();
    let date_json = new Date(this.data.lastActive);
    let dt_diffMs =(date - date_json);
    let dt_diffMn = Math.floor((dt_diffMs/1000)/60);
    let dt_diffHr = Math.floor(dt_diffMn/60);
    let dt_diffDy = Math.floor(dt_diffHr/24);
    // console.log(dt_diffDy);
    if(dt_diffMn < 60 && dt_diffMn > 0){
      return(
        <span>
          min
        </span>
      )
    }else if(dt_diffHr < 24 && dt_diffHr > 0){
      return(
        <span>
          min
        </span>
      )
    }else if(dt_diffDy > 0){
      return(
        <p>
        {dt_diffDy}
        </p>
      )
    }
  }

  showIcons(){
    this.setState({
      showIcons: true
    });
  }
  hideIcons(){
    this.setState({
      showIcons: !this.state.showIcons
    });
  }
  renderIcons(){
    if(this.state.showIcons === true){
      return(
        <div>
          <a href="#"><FontAwesome className="icon" name="pencil" /></a>
          <a href="#"><FontAwesome className="icon" name="envelope" /></a>
          <a href="#"><FontAwesome className="icon" name="tag" /></a>
          <a href="#"><FontAwesome className="icon" name="trash" /></a>
          </div>
      )
    }
  }

  render() {
    return (
      <tr onMouseEnter={this.showIcon} onMouseLeave={this.hideIcon} id={this.props.id}>
        <td><input type="checkbox" name="" value="" /></td>
        <td>{this.info}</td>
        <td>{this.point}</td>
        <td>{this.userGroup}</td>
        <td>{this.lastActive}</td>
        <td width="17%;">
          {this.renderIcons()}
          {!this.state.showIcons ? <FontAwesome className="icon" name="ellipsis-h" /> : null}
        </td>
      </tr>
    );
  }
}

export default App;
