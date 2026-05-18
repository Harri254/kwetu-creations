import { Specialist } from '../models/index.js';

export async function findSpecialistForService(serviceType) {
  return Specialist.findOne({ serviceTypes: serviceType });
}
