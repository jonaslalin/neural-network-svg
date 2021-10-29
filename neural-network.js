// -----------------------------------------------------------------------------

function Node(layer, index) {
  this.layer = layer;
  this.index = index;
}

function buildNodes(nNodesPerLayer) {
  return nNodesPerLayer
    .map(
      function buildNodesInLayer(nNodesInLayer, layer) {
        return Array.apply(null, Array(nNodesInLayer))
          .map(
            function buildNode(_, index) {
              return new Node(layer, index);
            }
          );
      }
    );
}

// -----------------------------------------------------------------------------

function Link(sourceLayer, sourceIndex, targetLayer, targetIndex) {
  this.sourceLayer = sourceLayer;
  this.sourceIndex = sourceIndex;
  this.targetLayer = targetLayer;
  this.targetIndex = targetIndex;
}

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
            linksInLayer[i] = new Link(
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
}

// -----------------------------------------------------------------------------

function NeuralNetwork(nodes, links) {
  this.nodes = nodes;
  this.links = links;
}

function buildNeuralNetwork(nNodesPerLayer) {
  return new NeuralNetwork(
    buildNodes(nNodesPerLayer),
    buildLinks(nNodesPerLayer)
  );
}

// -----------------------------------------------------------------------------

function NodeWithCoordinates(node, x, y) {
  this.node = node;
  this.x = x;
  this.y = y;
}

// -----------------------------------------------------------------------------

function LinkWithCoordinates(
  link,
  sourceNodeWithCoordinates,
  targetNodeWithCoordinates
) {
  this.link = link;
  this.sourceNodeWithCoordinates = sourceNodeWithCoordinates;
  this.targetNodeWithCoordinates = targetNodeWithCoordinates;
}

LinkWithCoordinates.prototype.x1 =
  function x1() {
    return this.sourceNodeWithCoordinates.x;
  };

LinkWithCoordinates.prototype.y1 =
  function y1() {
    return this.sourceNodeWithCoordinates.y;
  };

LinkWithCoordinates.prototype.x2 =
  function x2() {
    return this.targetNodeWithCoordinates.x;
  };

LinkWithCoordinates.prototype.y2 =
  function y2() {
    return this.targetNodeWithCoordinates.y;
  };

LinkWithCoordinates.prototype.x =
  function x(shiftFactor) {
    return (
      Math.floor(shiftFactor * (this.x2() - this.x1()))
      + this.x1()
    );
  };

LinkWithCoordinates.prototype.y =
  function y(shiftFactor) {
    return (
      Math.floor(shiftFactor * (this.y2() - this.y1()))
      + this.y1()
    );
  };

// -----------------------------------------------------------------------------

function NeuralNetworkWithCoordinates(
  nodesWithCoordinates,
  linksWithCoordinates
) {
  this.nodesWithCoordinates = nodesWithCoordinates;
  this.linksWithCoordinates = linksWithCoordinates;
}

function buildNeuralNetworkWithCoordinates(
  nNodesPerLayer,
  width,
  height,
  nodeRadius
) {
  var neuralNetwork = buildNeuralNetwork(nNodesPerLayer);

  var nLayers = nNodesPerLayer.length;

  var horizontalDistanceBetweenLayers = Math.floor(
    (width - 2 * nodeRadius)
    / (nLayers - 1)
  );

  var verticalDistanceBetweenNodes = Math.floor(
    (height - 2 * nodeRadius)
    / (Math.max.apply(null, nNodesPerLayer) - 1)
  );

  var xShiftPerLayer = Array.apply(null, Array(nLayers))
    .map(
      function xShift(_, layer) {
        return (
          layer * horizontalDistanceBetweenLayers
          + nodeRadius
        );
      }
    );

  var yShiftPerLayer = nNodesPerLayer
    .map(
      function yShift(nNodesInLayer) {
        var layerHeight = (
          (nNodesInLayer - 1) * verticalDistanceBetweenNodes
          + 2 * nodeRadius
        );
        return Math.floor((height - layerHeight) / 2);
      }
    );

  function buildNodeWithCoordinates(node) {
    var x = xShiftPerLayer[node.layer];
    var y = (
      yShiftPerLayer[node.layer]
      + node.index * verticalDistanceBetweenNodes
      + nodeRadius
    );
    return new NodeWithCoordinates(node, x, y);
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
    return new LinkWithCoordinates(
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

  return new NeuralNetworkWithCoordinates(
    nodesWithCoordinates,
    linksWithCoordinates
  );
}

// -----------------------------------------------------------------------------
