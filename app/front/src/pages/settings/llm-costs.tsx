const LlmCosts = () => {
    return (
        <>
            <div className="overflow-x-auto">
                <div className="min-w-[890px]">
                    <table className="table">
                        {/* head */}
                        <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox"/>
                                </label>
                            </th>
                            <th>Provider</th>
                            <th>Model</th>
                            <th>Context</th>
                            <th>1M input tokens</th>
                            <th>1M output tokens</th>
                            <th>Updated</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* row 1 */}
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox"/>
                                </label>
                            </th>
                            <td>OpenAI</td>
                            <td>gpt-4-32k</td>
                            <td>32K</td>
                            <th>$60</th>
                            <th>$120</th>
                            <th>March 16, 2024</th>
                        </tr>
                        {/* row 2 */}
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox"/>
                                </label>
                            </th>
                            <td>OpenAI</td>
                            <td>gpt-4-32k</td>
                            <td>32K</td>
                            <th>$60</th>
                            <th>$120</th>
                            <th>March 16, 2024</th>
                        </tr>
                        </tbody>
                        {/* foot */}
                        <tfoot>
                        <tr>
                            <th></th>
                            <th>Provider</th>
                            <th>Model</th>
                            <th>Context</th>
                            <th>1M input tokens</th>
                            <th>1M output tokens</th>
                            <th>Updated</th>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </>
    );
}

export default LlmCosts;
