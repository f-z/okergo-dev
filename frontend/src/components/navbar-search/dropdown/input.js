import React from "react"

export default function({ value, onChange }) {
  return (
    <input
      aria-haspopup="true"
      aria-controls="collapseExample"
      aria-expanded="false"
      autoComplete="off"
      className="form-control"
      value={value}
      onChange={onChange}
      placeholder={"Αναζήτηση"}
      role="combobox"
      type="text"
    />
  )
}
