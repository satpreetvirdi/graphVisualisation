import React, { useState } from "react";
import ReactDOM from 'react-dom';
import { Graph } from "react-d3-graph";
import "./App.css";

function App() {
  const [numNodes, setNumNodes] = useState("3"); // Changed to string
  const [edges, setEdges] = useState([]);
  const [isDirected, setIsDirected] = useState(false);
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [weight, setWeight] = useState("");
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  // Initialize nodes based on numNodes
  const initializeNodes = () => {
    const parsedNum = parseInt(numNodes, 10);
    const validNum = isNaN(parsedNum) || parsedNum < 1 ? 1 : parsedNum;
    const nodes = [];
    for (let i = 1; i <= validNum; i++) {
      nodes.push({ id: `Node ${i}` });
    }
    return nodes;
  };

  const handleAddEdge = () => {
    if (source === "" || target === "") {
      alert("Please select both source and target nodes.");
      return;
    }
    if (source === target) {
      alert("Source and target cannot be the same.");
      return;
    }
    if (weight === "") {
      alert("Please enter a weight for the edge.");
      return;
    }
    if (isNaN(weight)) {
      alert("Weight must be a numeric value.");
      return;
    }

    // Check for duplicate edges
    const duplicate = edges.find(
      (edge) =>
        edge.source === source &&
        edge.target === target &&
        isDirected === isDirected
    );
    if (duplicate) {
      alert("This edge already exists.");
      return;
    }

    setEdges([...edges, { source, target, weight: parseFloat(weight) }]);
    setSource("");
    setTarget("");
    setWeight("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nodes = initializeNodes();
    const links = edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      label: edge.weight.toString(), // Add label for weight
    }));
    setGraphData({ nodes, links });
  };

  const graphConfig = {
    directed: isDirected,
    nodeHighlightBehavior: true,
    node: {
      color: "lightblue",
      size: 400,
      highlightStrokeColor: "blue",
      labelProperty: "id",
    },
    link: {
      highlightColor: "lightblue",
      renderLabel: true, // Enable label rendering on links
      labelProperty: "label", // Property name for link labels
      fontSize: 12,
      fontColor: "black",
      fontWeight: "bold",
    },
    height: 600,
    width: 800,
    d3: {
      gravity: -400,
      linkLength: 150,
    },
  };

  return (
    <div className="App">
      <h1> Graph Visualizer </h1>{" "}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="numNodes"> Number of Nodes: </label>{" "}
          <input
            type="number"
            id="numNodes"
            min="1"
            value={numNodes}
            onChange={(e) => setNumNodes(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="isDirected"> Directed: </label>{" "}
          <input
            type="checkbox"
            id="isDirected"
            checked={isDirected}
            onChange={(e) => setIsDirected(e.target.checked)}
          />{" "}
        </div>
        <div className="edge-form">
          <h3> Add Edge </h3>{" "}
          <div className="form-group">
            <label htmlFor="source"> Source: </label>{" "}
            <select
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value=""> Select Source </option>{" "}
              {initializeNodes().map((node) => (
                <option key={node.id} value={node.id}>
                  {" "}
                  {node.id}{" "}
                </option>
              ))}{" "}
            </select>{" "}
          </div>
          <div className="form-group">
            <label htmlFor="target"> Target: </label>{" "}
            <select
              id="target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            >
              <option value=""> Select Target </option>{" "}
              {initializeNodes().map((node) => (
                <option key={node.id} value={node.id}>
                  {" "}
                  {node.id}{" "}
                </option>
              ))}{" "}
            </select>{" "}
          </div>
          <div className="form-group">
            <label htmlFor="weight"> Weight: </label>{" "}
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>
          <button type="button" onClick={handleAddEdge}>
            Add Edge{" "}
          </button>{" "}
        </div>
        <div className="current-edges">
          <h3> Current Edges </h3>{" "}
          {edges.length === 0 ? (
            <p> No edges added yet. </p>
          ) : (
            <ul>
              {" "}
              {edges.map((edge, index) => (
                <li key={index}>
                  {" "}
                  {edge.source} {isDirected ? "→" : "--"} {edge.target}(Weight:{" "}
                  {edge.weight}){" "}
                </li>
              ))}{" "}
            </ul>
          )}{" "}
        </div>
        <button type="submit" className="visualize-button">
          Visualize Graph{" "}
        </button>{" "}
      </form>
      {graphData.nodes.length > 0 && (
        <div className="graph-container">
          <h2> Graph Visualization </h2>{" "}
          <Graph
            id="graph-id" // Must be unique
            data={graphData}
            config={graphConfig}
          />{" "}
        </div>
      )}{" "}
    </div>
  );
}

export default App;
