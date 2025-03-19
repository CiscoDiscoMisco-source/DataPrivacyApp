import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { prepareNetworkData, setupForceSimulation } from '../utils/networkVisualization';

const CompanyNetwork = ({ companies, selectedCompany, preferences }) => {
  const d3Container = useRef(null);
  
  // Effect for creating/updating the D3 visualization
  useEffect(() => {
    if (d3Container.current && companies && companies.length > 0) {
      // Clear previous visualization
      d3.select(d3Container.current).selectAll('*').remove();
      
      // Setup dimensions
      const margin = { top: 20, right: 20, bottom: 20, left: 20 };
      const width = d3Container.current.clientWidth - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;
      
      // Create SVG container
      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      
      // Prepare data
      const { nodes, links } = prepareNetworkData(companies, selectedCompany, preferences);
      
      // Setup simulation
      const simulation = setupForceSimulation(nodes, links, width, height);
      
      // Create links
      const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke-width', d => d.value)
        .attr('stroke', d => d.allowed ? '#4caf50' : '#f44336')
        .attr('stroke-opacity', 0.6);
      
      // Create nodes
      const node = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', d => d.radius)
        .attr('fill', d => {
          if (d.type === 'user') return '#2196f3';
          if (d.id === selectedCompany) return '#ff9800';
          return '#9e9e9e';
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));
      
      // Add labels
      const label = svg.append('g')
        .selectAll('text')
        .data(nodes)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('font-size', 10)
        .attr('dx', 12)
        .attr('dy', 4)
        .attr('fill', '#333');
      
      // Add tooltips for links
      const linkTooltip = svg.append('g')
        .selectAll('text')
        .data(links)
        .enter()
        .append('text')
        .text(d => d.data_type)
        .attr('font-size', 8)
        .attr('fill', d => d.allowed ? '#4caf50' : '#f44336')
        .attr('opacity', 0);
      
      // Update positions on tick
      simulation.on('tick', () => {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);
        
        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);
        
        label
          .attr('x', d => d.x)
          .attr('y', d => d.y);
        
        linkTooltip
          .attr('x', d => (d.source.x + d.target.x) / 2)
          .attr('y', d => (d.source.y + d.target.y) / 2);
      });
      
      // Show tooltips on hover
      link
        .on('mouseover', function(event, d) {
          d3.select(this).attr('stroke-width', d.value * 1.5);
          
          // Find and show the corresponding tooltip
          linkTooltip
            .filter(tooltip => tooltip === d)
            .attr('opacity', 1);
        })
        .on('mouseout', function(event, d) {
          d3.select(this).attr('stroke-width', d.value);
          
          // Hide the tooltip
          linkTooltip.attr('opacity', 0);
        });
      
      // Drag functions
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      
      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    }
  }, [companies, selectedCompany, preferences]);
  
  return (
    <div className="company-network-container mt-4">
      <h3>Data Sharing Network</h3>
      <div className="network-legend mb-3">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#2196f3' }}></span>
          <span>You</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ff9800' }}></span>
          <span>Selected Company</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#9e9e9e' }}></span>
          <span>Other Companies</span>
        </div>
        <div className="legend-item">
          <span className="legend-line" style={{ backgroundColor: '#4caf50' }}></span>
          <span>Allowed Data Flow</span>
        </div>
        <div className="legend-item">
          <span className="legend-line" style={{ backgroundColor: '#f44336' }}></span>
          <span>Denied Data Flow</span>
        </div>
      </div>
      <div 
        className="network-visualization border rounded p-2" 
        ref={d3Container}
        style={{ width: '100%', height: '500px' }}
      ></div>
    </div>
  );
};

export default CompanyNetwork; 