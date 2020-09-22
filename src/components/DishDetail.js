import React, { Component } from "react";
import {Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal,
  ModalBody, ModalHeader, Label, FormGroup, } from "reactstrap";
import { Link } from "react-router-dom";
import { Control, Form, Errors } from "react-redux-form";
import { Loading } from "./LoadingComponent";
import { baseUrl } from "../shared/baseUrl";

const RenderDish = (props) => {
  let Dish = props.dish;
  if (props.isLoading) {
    return (
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  } else if (props.errMess) {
    return (
      <div className="container">
        <div className="row">
          <h4>{props.errMess}</h4>
        </div>
      </div>
    );
  } else if (props.dish != null) {
    return (
      <div key={Dish.id}>
        <Card>
          <CardImg width="100%" src={baseUrl + Dish.image} alt={Dish.name} />
          <CardBody>
            <CardTitle heading>{Dish.name}</CardTitle>
            <CardText>{Dish.description}</CardText>
          </CardBody>
        </Card>
      </div>
    );
  }
};

class RenderComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  handleSubmit(values, event) {
    this.toggleModal();
    console.log(
      this.props.dishId,
      values.rating,
      values.author,
      values.message
    );
    this.props.resetFeedbackForm();
    this.props.postComment(
      this.props.dishId,
      values.rating,
      values.author,
      values.message
    );
  }

  render() {
    const required = (val) => val && val.length;
    const maxLength = (len) => (val) => !val || val.length <= len;
    const minLength = (len) => (val) => val && val.length >= len;
    return (
      <CardBody className="p-1">
        <h3>Comments</h3>
        {this.props.comments.map((comment) => {
          return (
            <div key={comment.id}>
              <CardText>{comment.comment}</CardText>

              <CardText className="d-inline-block">
                -- {comment.author},
              </CardText>
              <CardText className="d-inline-block">
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                }).format(new Date(Date.parse(comment.date)))}
              </CardText>
            </div>
          );
        })}
        <div>
          <Button outline onClick={this.toggleModal}>
            <span className="fa fa-edit fa-lg"></span> Submit Comment
          </Button>

          <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
            <ModalBody>
              <Form
                model="feedback"
                onSubmit={(values) => this.handleSubmit(values)}
              >
                <FormGroup className="form-group">
                  <Label htmlFor=".rating">Rating</Label>
                  <Control.select
                    model=".rating"
                    name="rating"
                    className="form-control"
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Control.select>
                </FormGroup>
                <FormGroup className="form-group">
                  <Label htmlFor=".author">Your Name</Label>
                  <Control.text
                    model=".author"
                    id="author"
                    name="author"
                    placeholder="Your Name"
                    className="form-control"
                    validators={{
                      required,
                      maxLength: maxLength(15),
                      minLength: minLength(3),
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".author"
                    show="touched"
                    messages={{
                      required: "Required",
                      minLength: "Must be greater than 2 numbers",
                      maxLength: "Must be 15 numbers or less",
                    }}
                  />
                </FormGroup>
                <FormGroup className="form-group">
                  <Label htmlFor=".message" md={2}>
                    Comment
                  </Label>
                  <Control.textarea
                    model=".message"
                    id="message"
                    name="message"
                    rows="6"
                    className="form-control"
                  />
                </FormGroup>

                <Button type="submit" value="submit" color="primary">
                  Submit
                </Button>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      </CardBody>
    );
  }
}

class DishDetail extends Component {
  render() {
    console.log(this.props.dish.name)
    return (
      <div className="container">
        <div className="row">
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/menu">Menu</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{this.props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
            <h3>{this.props.dish.name}</h3>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-5 m-1">
            <RenderDish dish={this.props.dish} />
          </div>
          <div className="col-12 col-md-5 m-1">
            <RenderComments
              comments={this.props.comments}
              postComment={this.props.postComment}
              dishId={this.props.dish.id}
              resetFeedbackForm={this.props.resetFeedbackForm}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DishDetail;


//  json-server --watch db.json -p 3001 -d 2000

