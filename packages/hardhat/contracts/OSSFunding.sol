// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IFreeMintToken {
    function mint(address to, uint256 quantity) external;
}

contract OSSFunding {
    struct GithubRepo {
        address payable maintainer;
        bool registered;
        string github_repo;
        uint256 stored_value;
    }

    struct Contribution {
        address contributor;
        uint256 total_contributions;
    }

    struct Task {
        string title;
        uint256 amount;
        address maintainer;
    }

    address payable owner;
    IFreeMintToken public freeMintToken;

    constructor(address freeMintTokenAddress) {
        owner = payable(msg.sender); // Set the owner to the contract deployer
        freeMintToken = IFreeMintToken(freeMintTokenAddress);
    }

    mapping(string => GithubRepo) public github_repo;
    mapping(address => mapping(string => Contribution)) public contribution;

    Task[] tasks;

    event GithubRepoAdded(string indexed repo, address maintainer);
    event ContributionReceived(
        uint256 amount,
        address contributor,
        address indexed maintainer
    );

    function registerProject(string memory repo, address maintainer) public {
        // require(!github_repo[repo].registered, "Project was already registered");

        github_repo[repo] = GithubRepo({
            maintainer: payable(maintainer),
            registered: true,
            github_repo: repo,
            stored_value: 0
        });

        emit GithubRepoAdded(repo, maintainer);
    }

    function contributeToProject(
        string memory repo,
        address contributor
    ) public payable returns (address) {
        require(github_repo[repo].registered, "Project is not registered");
        require(msg.value > 0, "Contribution must be greater than 0");

        address maintainer = github_repo[repo].maintainer;

        github_repo[repo].stored_value += msg.value;

        uint256 total = contribution[contributor][repo].total_contributions;
        total += msg.value;

        contribution[contributor][repo] = Contribution({
            contributor: contributor,
            total_contributions: total
        });

        freeMintToken.mint(contributor, 1);

        emit ContributionReceived(msg.value, contributor, maintainer);

        return maintainer;
    }

    function getProjectMaintainer(
        string memory repo
    ) public view returns (address, uint256) {
        return (github_repo[repo].maintainer, github_repo[repo].stored_value);
    }

    function isProjectMaintainer(
        string memory repo,
        address user_address
    ) public view returns (bool) {
        if (github_repo[repo].maintainer == user_address) {
            return true;
        } else {
            return false;
        }
    }

    function liquidateProject(
        string memory repo,
        address maintainer
    ) public payable returns (string memory, address, uint256) {
        require(
            github_repo[repo].maintainer == maintainer,
            "You are not authorized to call this function."
        );
        require(
            github_repo[repo].stored_value > 0,
            "Project does not have enough balance to proceed."
        );

        string memory project_link = github_repo[repo].github_repo;
        address project_maintainer = github_repo[repo].maintainer;
        uint256 balance = github_repo[repo].stored_value;

        (bool success, ) = github_repo[repo].maintainer.call{value: balance}(
            ""
        );

        require(success, "Withdrawal failed, try again later.");

        github_repo[repo].stored_value -= balance;

        return (project_link, project_maintainer, balance);
    }

    function createTask(
        string memory title,
        uint256 amount,
        address maintainer
    ) public returns (bool) {
        tasks.push(Task(title, amount, maintainer));

        return true;
    }

    // Contributor can a accept a task
    function acceptTask(uint256 ethAmountFor1Dollar) public payable {
        require(
            msg.value >= ethAmountFor1Dollar,
            "Minimum donation is 1 dollar equivalent in ETH"
        );

        string memory rank;

        if (msg.value >= 500 * ethAmountFor1Dollar) {
            rank = "Platinum";
        } else if (msg.value >= 100 * ethAmountFor1Dollar) {
            rank = "Gold";
        } else if (msg.value >= 20 * ethAmountFor1Dollar) {
            rank = "Silver";
        } else if (msg.value >= 5 * ethAmountFor1Dollar) {
            rank = "Bronze";
        } else {
            rank = "Supporter";
        }
    }

    // Returns all the tasks
    function getAllTasks() public view returns (Task[] memory) {
        return tasks;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}
    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
