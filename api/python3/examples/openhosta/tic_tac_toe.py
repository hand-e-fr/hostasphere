import os

from OpenHosta import emulate, config

gpt4o = config.Model(
    model="gpt-4o",
    base_url="https://api.openai.com/v1/chat/completions",
    api_key=os.getenv('OPENAI_API_KEY')
)

gpt4omini = config.Model(
    model="gpt-4o-mini",
    base_url="https://api.openai.com/v1/chat/completions",
    api_key=os.getenv('OPENAI_API_KEY')
)

def tic_tac_toe(grid: dict[int, dict[int, str]]) -> dict[int, dict[int, str]]:
    """
    Play a game of tic-tac-toe, given the current grid represented as a dictionary of dictionaries where the keys are the row and column numbers and the values are the player's symbol.
    Player 1 is represented by 'X' and player 2 is represented by 'O'.
    the func caller is player 1, you are player 2.
    """
    return emulate(model=gpt4o)


def check_winner(grid: dict[int, dict[int, str]]) -> int:
    """
    Check if there is a winner in the game of tic-tac-toe.
    Return 1 if player 1 wins, 2 if player 2 wins, 0 if it's a tie, and -1 if the game is still ongoing.
    """
    return emulate(model=gpt4omini)

if __name__ == '__main__':
    grid = {
        "1": {"1": ' ', "2": ' ', "3": ' '},
        "2": {"1": ' ', "2": ' ', "3": ' '},
        "3": {"1": ' ', "2": ' ', "3": ' '}
    }

    # i play first against the AI

    while check_winner(grid) == -1:
        grid = tic_tac_toe(grid)
        print(grid)
        if check_winner(grid) != -1:
            break
        row = str(input("Enter row number: "))
        col = str(input("Enter column number: "))
        grid[row][col] = 'X'
        print(grid)
        if check_winner(grid) != -1:
            break
        grid = tic_tac_toe(grid)
        for *row in grid:
            print(grid[row])


    winner = check_winner(grid)
    if winner == 0:
        print("It's a tie!")
    else:
        print(f"Player {winner} wins!")