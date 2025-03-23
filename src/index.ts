import { mastra } from './mastra';

async function main() {
    const researchNetwork = mastra.getNetwork('Research Network');

    if (!researchNetwork) {
        throw new Error('Research network not found');
    }

    console.log('🔍 Starting research...\n');

    const result = await researchNetwork.stream('What are the latest developments in quantum computing?', {
        maxSteps: 10,
    });

    for await (const part of result.fullStream) {
        switch (part.type) {
            case 'error':
                console.error(part.error);
                break;
            case 'text-delta':
                process.stdout.write(part.textDelta);
                break;
            case 'tool-call':
                console.log(`\n🛠️ Using ${part.toolName}...`);
                break;
            case 'tool-result':
                console.log(`\n✅ Got result from tool`);
                break;
        }
    }

    console.log('\n\n📊 Agent Interaction Summary:');
    console.log(researchNetwork.getAgentInteractionSummary());

    console.log('\n🏁 Research complete!');
}

main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
}); 