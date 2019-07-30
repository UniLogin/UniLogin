pragma solidity ^0.5.0;

import "zos-lib/contracts/upgradeability/BaseUpgradeabilityProxy.sol";

import "../interfaces/IERC897.sol";
import "../tools/Initializable.sol";


contract BaseKitsuneProxy is BaseUpgradeabilityProxy, Initializable {
    function _upgradeToAndInitialize(address _logic, bytes memory _data)
    internal
    {
        require(IERC897(_logic).implementation() == address(0), "invalid-master-implementation");
        _upgradeTo(_logic);
        if (_data.length > 0) {
            _setInitialized(false);
            // solium-disable-next-line security/no-low-level-calls
            (bool success,) = _logic.delegatecall(_data);
            require(success, "failed-to-initialize");
        }
    }
}
