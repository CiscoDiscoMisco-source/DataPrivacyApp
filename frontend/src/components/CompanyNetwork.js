import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

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
      
      // Prepare data for network visualization
      // Create a network of companies with data sharing relationships
      const nodes = [];
      const links = [];
      
      // Add user node at the center
      nodes.push({
        id: 'user',
        name: 'You',
        type: 'user',
        radius: 30
      });
      
      // Add company nodes
      companies.forEach(companyData => {
        const company = companyData.company || companyData;
        const terms = companyData.terms || [];
        
        nodes.push({
          id: company.company_id,
          name: company.name,
          type: 'company',
          domain: company.domain,
          radius: 20,
          terms: terms.length,
          selected: selectedCompany && parseInt(selectedCompany) === company.company_id
        });
        
        // Link from user to company
        links.push({
          source: 'user',
          target: company.company_id,
          value: 1
        });
        
        // Find related companies for data sharing (simplified model)
        // In a real app, this would use actual data sharing relationships
        companies.forEach(otherCompanyData => {
          const otherCompany = otherCompanyData.company || otherCompanyData;
          
          // Skip self-links and already created links
          if (company.company_id === otherCompany.company_id) return;
          
          // Create link based on domain similarity (simplified model)
          // In a real app, use actual data sharing connections
          const companyDomain = company.domain.split('.').slice(-2).join('.');
          const otherDomain = otherCompany.domain.split('.').slice(-2).join('.');
          
          if (companyDomain === otherDomain) {
            links.push({
              source: company.company_id,
              target: otherCompany.company_id,
              value: 0.5
            });
          }
        });
      });
      
      // Create scales
      const color = d3.scaleOrdinal()
        .domain(['user', 'company'])
        .range(['#e74c3c', '#3498db']);
      
      // Create force simulation
      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => d.radius + 10));
      
      // Add links
      const link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke-width', d => d.value * 2)
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6);
      
      // Add nodes
      const node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(nodes)
        .enter()
        .append('g');
      
      // Add circles to nodes
      node.append('circle')
        .attr('r', d => d.radius)
        .attr('fill', d => color(d.type))
        .attr('stroke', d => d.selected ? '#e74c3c' : '#fff')
        .attr('stroke-width', d => d.selected ? 3 : 1)
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));
      
      // Add text labels to nodes
      node.append('text')
        .text(d => d.name)
        .attr('x', 0)
        .attr('y', d => d.radius + 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#333')
        .style('font-size', '12px');
      
      // Add titles for tooltips
      node.append('title')
        .text(d => {
          if (d.type === 'user') return 'You';
          return `${d.name}\nDomain: ${d.domain}\nData Sharing Terms: ${d.terms}`;
        });
      
      // Update positions on each tick
      simulation.on('tick', () => {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);
        
        node
          .attr('transform', d => `translate(${d.x},${d.y})`);
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
      
      // Add a legend
      const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 120}, 20)`);
      
      // Legend for user node
      legend.append('circle')
        .attr('r', 8)
        .attr('fill', color('user'))
        .attr('cx', 10)
        .attr('cy', 10);
      
      legend.append('text')
        .attr('x', 25)
        .attr('y', 15)
        .text('You')
        .style('font-size', '12px');
      
      // Legend for company nodes
      legend.append('circle')
        .attr('r', 8)
        .attr('fill', color('company'))
        .attr('cx', 10)
        .attr('cy', 40);
      
      legend.append('text')
        .attr('x', 25)
        .attr('y', 45)
        .text('Companies')
        .style('font-size', '12px');
    }
  }, [companies, selectedCompany, preferences]);
  
  return (
    <div className="company-network-container">
      <div ref={d3Container} className="company-network-visualization" />
    </div>
  );
};

export default CompanyNetwork; 