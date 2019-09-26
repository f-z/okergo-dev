import React from "react"
import PostFooter from "./footer"
import MisagoMarkup from "misago/components/misago-markup"

export default function(props) {
  return (
    <li id={"post-" + props.post.id} className="post post-infeed">
      <div className="post-border">
        <div className="post-body">
          <div className="panel panel-default panel-post">
            <PostBody content={props.post.content} />
            <PostFooter
              category={props.post.category}
              post={props.post}
              thread={props.post.thread}
            />
          </div>
        </div>
      </div>
    </li>
  )
}

export function PostBody(props) {
  if (props.content) {
    return (
      <div className="panel-body">
        <MisagoMarkup markup={props.content} />
      </div>
    )
  }

  return (
    <div className="panel-body panel-body-invalid">
      <p className="lead">
        {"Το περιεχόμενο αυτής της προσφοράς δεν μπορεί να εμφανιστεί"}
      </p>
      <p className="text-muted">
        {"Αυτό το λάθος προκαλέστηκε από μη έγκυρη τροποποίηση της αγγελίας"}
      </p>
    </div>
  )
}
