.. _devops:

Deployment
==========

Prerequisites
  Install universal-login toolkit:

  ::

    yarn global add universal-login-ops

Test token
----------

To deploy test token use deploy token
``universal-login deploy:token --nodeUrl [url] --privateKey [privateKey]``

Example:

::

  universal-login deploy:token --nodeUrl http://localhost:18545 --privateKey 0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797
