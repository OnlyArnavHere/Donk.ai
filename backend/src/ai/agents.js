import { v4 as uuidv4 } from 'uuid';
import { callSupervisor, setJobStatus } from '../services/supervisor.service.js';

/**
 * AI Agent Interfaces
 *
 * The backend NEVER contains AI logic. These interfaces define the contract
 * between the backend and the Python Supervisor Agent. Each interface maps
 * to a downstream agent managed by the Supervisor.
 *
 * The Supervisor Agent routes requests to the appropriate downstream agent:
 *   - Requirement Agent
 *   - Architecture Agent
 *   - Component Agent
 *   - PCB Agent
 *   - Validation Agent
 *   - Documentation Agent
 */

const AGENT_ACTIONS = {
  requirement: 'generate_requirements',
  architecture: 'generate_architecture',
  component: 'generate_components',
  pcb: 'generate_pcb',
  validation: 'generate_validation',
  documentation: 'generate_documentation',
};

/**
 * Run a specific AI agent via the Supervisor.
 */
const runAgent = async (agentType, payload) => {
  const action = AGENT_ACTIONS[agentType];
  if (!action) {
    throw new Error(`Unknown agent type: ${agentType}`);
  }
  return callSupervisor({ action, ...payload });
};

// ---- Individual agent interfaces ----

export const RequirementAgent = {
  generate: (payload) => runAgent('requirement', payload),
};

export const ArchitectureAgent = {
  generate: (payload) => runAgent('architecture', payload),
};

export const ComponentAgent = {
  generate: (payload) => runAgent('component', payload),
};

export const PCBAgent = {
  generate: (payload) => runAgent('pcb', payload),
};

export const ValidationAgent = {
  generate: (payload) => runAgent('validation', payload),
};

export const DocumentationAgent = {
  generate: (payload) => runAgent('documentation', payload),
};

/**
 * Run the full workflow (Supervisor orchestrates all agents).
 */
export const runFullWorkflow = async (payload) => {
  const jobId = uuidv4();
  setJobStatus(jobId, 'queued', { action: 'full_workflow' });
  return callSupervisor({ action: 'run_workflow', jobId, ...payload });
};

/**
 * Run a chat message through the Supervisor.
 */
export const runChat = async (payload) => {
  return callSupervisor({ action: 'chat', ...payload });
};

export const AGENT_TYPES = Object.keys(AGENT_ACTIONS);
