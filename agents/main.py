import sys
import json
from crewai import Agent, Task, Crew, Process

def get_legal_crew(input_data):
    legal_agent = Agent(
        role='Legal Governance Specialist',
        goal='Generate and validate association bylaws and contracts',
        backstory='Expert in Brazilian Third Sector law and RDC 1.014/2026 compliance.',
        allow_delegation=False,
        verbose=True
    )

    task = Task(
        description=f"Process legal request: {input_data}",
        agent=legal_agent,
        expected_output="A JSON object containing the status of the legal document generation or validation."
    )

    crew = Crew(agents=[legal_agent], tasks=[task], verbose=True)
    return crew.kickoff()

def get_patient_crew(input_data):
    patient_agent = Agent(
        role='Patient Care Coordinator',
        goal='Validate patient documents and prescriptions',
        backstory='Specialist in medical cannabis prescriptions and Portaria 344/98.',
        allow_delegation=False,
        verbose=True
    )

    task = Task(
        description=f"Validate patient document: {input_data}",
        agent=patient_agent,
        expected_output="A JSON object confirming the validity of the prescription or document."
    )

    crew = Crew(agents=[patient_agent], tasks=[task], verbose=True)
    return crew.kickoff()

def get_grow_crew(input_data):
    grow_agent = Agent(
        role='Cultivation Specialist',
        goal='Monitor plant health and track seed-to-sale data',
        backstory='Expert in organic cannabis cultivation and IoT monitoring.',
        allow_delegation=False,
        verbose=True
    )

    task = Task(
        description=f"Check cultivation status: {input_data}",
        agent=grow_agent,
        expected_output="A JSON object with real-time health data of the plants."
    )

    crew = Crew(agents=[grow_agent], tasks=[task], verbose=True)
    return crew.kickoff()

def get_regulatory_crew(input_data):
    regulatory_agent = Agent(
        role='Compliance Officer',
        goal='Ensure all operations follow ANVISA standards',
        backstory='Expert in RDC 1.014/2026 and pharmaceutical quality standards.',
        allow_delegation=False,
        verbose=True
    )

    task = Task(
        description=f"Perform compliance check: {input_data}",
        agent=regulatory_agent,
        expected_output="A compliance report in JSON format."
    )

    crew = Crew(agents=[regulatory_agent], tasks=[task], verbose=True)
    return crew.kickoff()

def get_audit_crew(input_data):
    audit_agent = Agent(
        role='Financial Auditor',
        goal='Manage surplus and partner payments',
        backstory='Expert in non-profit financial management and smart wallet transparency.',
        allow_delegation=False,
        verbose=True
    )

    task = Task(
        description=f"Audit financial transaction: {input_data}",
        agent=audit_agent,
        expected_output="A financial audit report in JSON format."
    )

    crew = Crew(agents=[audit_agent], tasks=[task], verbose=True)
    return crew.kickoff()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing arguments"}))
        sys.exit(1)

    agent_name = sys.argv[1]
    input_data = json.loads(sys.argv[2])

    try:
        import os
        if not os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY") == "YOUR_API_KEY":
            # Mocking output for testing without API key
            mock_responses = {
                "legal": {"status": "success", "message": "Bylaws generated for association."},
                "patient": {"status": "validated", "message": "Prescription is valid according to Portaria 344/98."},
                "grow": {"status": "healthy", "telemetry": {"temp": 24.5, "humidity": 60}},
                "regulatory": {"status": "compliant", "report": "All standards met for RDC 1.014/2026."},
                "audit": {"status": "audited", "balance": "100% reinvested"}
            }
            result = mock_responses.get(agent_name, "Agent output (mocked)")
        else:
            if agent_name == 'legal':
                result = get_legal_crew(input_data)
            elif agent_name == 'patient':
                result = get_patient_crew(input_data)
            elif agent_name == 'grow':
                result = get_grow_crew(input_data)
            elif agent_name == 'regulatory':
                result = get_regulatory_crew(input_data)
            elif agent_name == 'audit':
                result = get_audit_crew(input_data)
            else:
                result = "Agent not found"

        print(json.dumps({"agent": agent_name, "output": result}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
