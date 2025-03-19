import * as d3 from 'd3';

/**
 * Prepares nodes and links data for the network visualization
 * 
 * @param {Array} companies - List of companies to visualize
 * @param {string|number} selectedCompany - ID of the currently selected company
 * @param {Array} preferences - List of user preferences for these companies
 * @returns {Object} Object containing nodes and links arrays
 */
export const prepareNetworkData = (companies, selectedCompany, preferences = []) => {
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
    
    // Create data-sharing links between user and company based on preferences
    if (preferences && preferences.length > 0) {
      // Find preferences for this company
      const companyPrefs = preferences.filter(pref => 
        pref.company_id === company.company_id
      );
      
      companyPrefs.forEach(pref => {
        links.push({
          source: 'user',
          target: company.company_id,
          value: 2,
          data_type: pref.data_type,
          allowed: pref.allowed
        });
      });
    } else {
      // If no specific preferences, add a generic link
      links.push({
        source: 'user',
        target: company.company_id,
        value: 1,
        data_type: 'Generic Data',
        allowed: false
      });
    }
  });
  
  // Create links between companies (simplified model)
  companies.forEach(companyData => {
    const company = companyData.company || companyData;
    
    companies.forEach(otherCompanyData => {
      const otherCompany = otherCompanyData.company || otherCompanyData;
      
      // Skip self-links
      if (company.company_id === otherCompany.company_id) return;
      
      // Create link based on domain similarity (simplified model)
      const companyDomain = company.domain.split('.').slice(-2).join('.');
      const otherDomain = otherCompany.domain.split('.').slice(-2).join('.');
      
      if (companyDomain === otherDomain) {
        links.push({
          source: company.company_id,
          target: otherCompany.company_id,
          value: 1,
          data_type: 'Domain Sharing',
          allowed: true
        });
      }
    });
  });
  
  return { nodes, links };
};

/**
 * Sets up the D3 force simulation for the network
 * 
 * @param {Array} nodes - List of nodes in the network
 * @param {Array} links - List of links between nodes
 * @param {number} width - Width of the simulation area
 * @param {number} height - Height of the simulation area
 * @returns {Object} D3 force simulation
 */
export const setupForceSimulation = (nodes, links, width, height) => {
  return d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links)
      .id(d => d.id)
      .distance(100))
    .force('charge', d3.forceManyBody()
      .strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide()
      .radius(d => d.radius + 10));
}; 