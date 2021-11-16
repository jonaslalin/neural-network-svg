'use strict';

// -----------------------------------------------------------------------------

var nn = nn || {};

// -----------------------------------------------------------------------------

nn.Node =
  function Node(layer, index) {
    this.layer = layer;
    this.index = index;
  };

nn.Node.prototype.key =
  function key() {
    return this.layer + '-' + this.index;
  };

nn.buildNodes =
  function buildNodes(nNodesPerLayer) {
    return nNodesPerLayer
      .map(
        function buildNodesInLayer(nNodesInLayer, layer) {
          return Array.apply(null, Array(nNodesInLayer))
            .map(
              function buildNode(_, index) {
                return new nn.Node(layer, index);
              }
            );
        }
      );
  };

// -----------------------------------------------------------------------------

nn.Link =
  function Link(
    sourceLayer,
    sourceIndex,
    targetLayer,
    targetIndex
  ) {
    this.sourceLayer = sourceLayer;
    this.sourceIndex = sourceIndex;
    this.targetLayer = targetLayer;
    this.targetIndex = targetIndex;
  };

nn.Link.prototype.key =
  function key() {
    return (
      this.sourceLayer
      + '-'
      + this.sourceIndex
      + '-'
      + this.targetLayer
      + '-'
      + this.targetIndex
    );
  };

nn.buildLinks =
  function buildLinks(nNodesPerLayer) {
    return nNodesPerLayer
      .map(
        function buildAllLinks(
          nNodesInSourceLayer,
          sourceLayer,
          nNodesPerLayer
        ) {
          var nLayers = nNodesPerLayer.length;
          if (sourceLayer + 1 > nLayers - 1) {
            return [];
          }
          var targetLayer = sourceLayer + 1;
          var nNodesInTargetLayer = nNodesPerLayer[targetLayer];
          var nLinksInLayer = nNodesInSourceLayer * nNodesInTargetLayer;
          var linksInLayer = Array.apply(null, Array(nLinksInLayer));
          for (
            var sourceIndex = 0;
            sourceIndex < nNodesInSourceLayer;
            sourceIndex++
          ) {
            for (
              var targetIndex = 0;
              targetIndex < nNodesInTargetLayer;
              targetIndex++
            ) {
              var i = sourceIndex * nNodesInTargetLayer + targetIndex;
              linksInLayer[i] = new nn.Link(
                sourceLayer,
                sourceIndex,
                targetLayer,
                targetIndex
              );
            }
          }
          return linksInLayer;
        }
      );
  };

// -----------------------------------------------------------------------------

nn.NeuralNetwork =
  function NeuralNetwork(nodes, links) {
    this.nodes = nodes;
    this.links = links;
  };

nn.buildNeuralNetwork =
  function buildNeuralNetwork(nNodesPerLayer) {
    return new nn.NeuralNetwork(
      nn.buildNodes(nNodesPerLayer),
      nn.buildLinks(nNodesPerLayer)
    );
  };

// -----------------------------------------------------------------------------

nn.NodeWithCoordinates =
  function NodeWithCoordinates(node, x, y) {
    this.node = node;
    this.x = x;
    this.y = y;
  };

// -----------------------------------------------------------------------------

nn.LinkWithCoordinates =
  function LinkWithCoordinates(
    link,
    sourceNodeWithCoordinates,
    targetNodeWithCoordinates
  ) {
    this.link = link;
    this.sourceNodeWithCoordinates = sourceNodeWithCoordinates;
    this.targetNodeWithCoordinates = targetNodeWithCoordinates;
  };

nn.LinkWithCoordinates.prototype.x1 =
  function x1() {
    return this.sourceNodeWithCoordinates.x;
  };

nn.LinkWithCoordinates.prototype.y1 =
  function y1() {
    return this.sourceNodeWithCoordinates.y;
  };

nn.LinkWithCoordinates.prototype.x2 =
  function x2() {
    return this.targetNodeWithCoordinates.x;
  };

nn.LinkWithCoordinates.prototype.y2 =
  function y2() {
    return this.targetNodeWithCoordinates.y;
  };

nn.LinkWithCoordinates.prototype.textX =
  function textX(position) {
    return (
      Math.floor(position * (this.x2() - this.x1()))
      + this.x1()
    );
  };

nn.LinkWithCoordinates.prototype.textY =
  function textY(position) {
    return (
      Math.floor(position * (this.y2() - this.y1()))
      + this.y1()
    );
  };

// -----------------------------------------------------------------------------

nn.NeuralNetworkWithCoordinates =
  function NeuralNetworkWithCoordinates(
    nodesWithCoordinates,
    linksWithCoordinates,
    nodeRadius
  ) {
    this.nodesWithCoordinates = nodesWithCoordinates;
    this.linksWithCoordinates = linksWithCoordinates;
    this.nodeRadius = nodeRadius;
  };

nn.buildNeuralNetworkWithCoordinates =
  function buildNeuralNetworkWithCoordinates(
    nNodesPerLayer,
    width,
    height,
    nodeRadius
  ) {
    var neuralNetwork = nn.buildNeuralNetwork(nNodesPerLayer);

    var nLayers = nNodesPerLayer.length;

    var horizontalDistance = Math.floor(
      (width - 2 * nodeRadius) / (nLayers - 1)
    );

    var verticalDistance = Math.floor(
      (height - 2 * nodeRadius)
      / (Math.max.apply(null, nNodesPerLayer) - 1)
    );

    var xShiftPerLayer = Array.apply(null, Array(nLayers))
      .map(
        function xShift(_, layer) {
          return nodeRadius + layer * horizontalDistance;
        }
      );

    var yShiftPerLayer = nNodesPerLayer
      .map(
        function yShift(nNodesInLayer) {
          var layerHeight = (
            2 * nodeRadius
            + (nNodesInLayer - 1) * verticalDistance
          );
          return Math.floor((height - layerHeight) / 2);
        }
      );

    function buildNodeWithCoordinates(node) {
      var x = xShiftPerLayer[node.layer];
      var y = (
        yShiftPerLayer[node.layer]
        + nodeRadius
        + node.index * verticalDistance
      );
      return new nn.NodeWithCoordinates(node, x, y);
    }

    var nodesWithCoordinates = neuralNetwork.nodes
      .map(
        function buildNodesWithCoordinatesInLayer(nodesInLayer) {
          return nodesInLayer.map(buildNodeWithCoordinates);
        }
      );

    function buildLinkWithCoordinates(link) {
      var sourceNodeWithCoordinates =
        nodesWithCoordinates[link.sourceLayer][link.sourceIndex];
      var targetNodeWithCoordinates =
        nodesWithCoordinates[link.targetLayer][link.targetIndex];
      return new nn.LinkWithCoordinates(
        link,
        sourceNodeWithCoordinates,
        targetNodeWithCoordinates
      );
    }

    var linksWithCoordinates = neuralNetwork.links
      .map(
        function buildLinksWithCoordinatesInLayer(linksInLayer) {
          return linksInLayer.map(buildLinkWithCoordinates);
        }
      );

    return new nn.NeuralNetworkWithCoordinates(
      nodesWithCoordinates,
      linksWithCoordinates,
      nodeRadius
    );
  };

// -----------------------------------------------------------------------------
