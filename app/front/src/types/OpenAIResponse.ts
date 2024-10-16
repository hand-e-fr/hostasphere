export interface OpenAIResponse {
    id: string
    object: string
    created: number
    model: string
    // choices: Choice[]
    // usage: Usage
    system_fingerprint: string
}

export interface Choice {
    index: number
    message: Message
    logprobs: string | null
    finish_reason: string
}

export interface Message {
    role: string
    content: string
    refusal: string | null
}

export interface Usage {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
    prompt_tokens_details: PromptTokensDetails
    completion_tokens_details: CompletionTokensDetails
}

export interface PromptTokensDetails {
    cached_tokens: number
}

export interface CompletionTokensDetails {
    reasoning_tokens: number
}

export default function decodeOpenAIResponse(result: any): OpenAIResponse {
    return {
        id: result.id,
        object: result.object,
        created: result.created,
        model: result.model/*,
        choices: result.choices.map((choice: any) => ({
            index: choice.index,
            message: {
                role: choice.message.role,
                content: choice.message.content,
                refusal: choice.message.refusal || null,
            },
            logprobs: choice.logprobs || null,
            finish_reason: choice.finish_reason,
        }))*/,
        // usage: {
        //     prompt_tokens: result.usage.prompt_tokens,
        //     completion_tokens: result.usage.completion_tokens,
        //     total_tokens: result.usage.total_tokens,
        //     prompt_tokens_details: {
        //         cached_tokens: result.usage.prompt_tokens_details.cached_tokens,
        //     },
        //     completion_tokens_details: {
        //         reasoning_tokens: result.usage.completion_tokens_details.reasoning_tokens,
        //     },
        // },
        system_fingerprint: result.system_fingerprint,
    };
}
