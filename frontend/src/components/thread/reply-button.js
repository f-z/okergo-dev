import React from "react"

export default function(props) {
  const buttonText = (props.thread.category.name == "Ιδιωτικές συνομιλίες" ? "Απάντηση" : "Προσφορά")
  return (
    <button
      className={props.className || "btn btn-primary btn-outline"}
      onClick={props.onClick}
      type="button"
    >
      <span className="material-icon">chat</span>
      {buttonText}
    </button>
  )
}
