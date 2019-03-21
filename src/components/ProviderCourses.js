import React, { Component } from "react"
import { connect } from "react-redux"
import { fetchCourses } from "../actions/index"
import CardDeck from "react-bootstrap/CardDeck"
import Dropdown from "react-bootstrap/Dropdown"
import Button from "react-bootstrap/Button"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Course from "./Course"
import Jumbotron from "react-bootstrap/Jumbotron"
import _ from "lodash"
import "../App.css"
import CustomMenu from "./CustomMenu"
export class ProviderCourses extends Component {
    state = { localCourses: [], childSubjects: [], filter: "All" }
    componentDidMount() {
        this.props.fetchCourses().then(res => {
            let courses = this.props.providers[this.props.match.params.id]
            let childSubjects = courses
                .filter(item => {
                    return item["Child Subject"] !== ""
                })
                .map(item => {
                    return item["Child Subject"]
                })
            childSubjects = Array.from(new Set(childSubjects))
            childSubjects.unshift("All")
            this.setState({ localCourses: courses, childSubjects })
        })
    }
    sortLength(val) {
        if (val === "high") {
            this.setState({ localCourses: _.sortBy(this.state.localCourses, "Length").reverse() })
        } else {
            this.setState({ localCourses: _.sortBy(this.state.localCourses, "Length") })
        }
    }
    onSelect(eventKey, eventObject) {
        this.setState({ filter: this.state.childSubjects[eventKey] })
    }
    render() {
        let provider = this.props.match.params.id
        if (this.state.localCourses && this.state.localCourses.length > 1) {
            return (
                <>
                    <div>
                        <Jumbotron className='jumbotron' />
                    </div>
                    <h3 className='total-courses-text'>
                        Total Courses Found:
                        {
                            this.state.localCourses.filter((item, index) => {
                                return this.state.filter === "All" || item["Child Subject"] === this.state.filter
                            }).length
                        }
                    </h3>
                    <div>
                        <Jumbotron className='jumbotron'>
                            <div style={{ display: "-webkit-inline-box" }}>
                                <h4 style={{ "margin-bottom": "1.5rem" }}>All Courses from {provider}</h4>
                                <Dropdown as={ButtonGroup} style={{ position: "absolute", right: "10%" }}>
                                    <Button variant='success'>Sort By:</Button>

                                    <Dropdown.Toggle split variant='success' id='dropdown-split-basic' />

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={e => this.sortLength("high")}>Highest length</Dropdown.Item>
                                        <Dropdown.Item onClick={e => this.sortLength("low")}>Lowest length</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown as={ButtonGroup} style={{ position: "absolute", right: "20%" }}>
                                    <Button variant='success'>
                                        Filter: {this.state.filter === "All" ? "" : this.state.filter}
                                    </Button>
                                    <Dropdown.Toggle split variant='success' id='dropdown-split-basic' />

                                    <Dropdown.Menu as={CustomMenu} className='custom-dropdown'>
                                        {this.state.childSubjects.map((item, index) => {
                                            if (item === this.state.filter) {
                                                return (
                                                    <Dropdown.Item eventKey={index} active>
                                                        {item}
                                                    </Dropdown.Item>
                                                )
                                            }
                                            return (
                                                <Dropdown.Item onSelect={(ek, eo) => this.onSelect(ek, eo)} eventKey={index}>
                                                    {item}
                                                </Dropdown.Item>
                                            )
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                                ,
                            </div>
                            <CardDeck className='card-deck'>
                                {this.state.localCourses.map((item, index) => {
                                    if (this.state.filter === "All" || item["Child Subject"] === this.state.filter)
                                        return <Course key={index} course={item} />
                                    return ""
                                })}
                            </CardDeck>
                        </Jumbotron>
                    </div>
                </>
            )
        } else {
            return <div>Loading...</div>
        }
    }
}

const mapStateToProps = state => {
    return {
        allCourses: state.courses.allCourses,
        providers: state.courses.providers
    }
}
export default connect(
    mapStateToProps,
    { fetchCourses }
)(ProviderCourses)
