import torch
import torch.nn as nn
import torch.nn.functional as F

class SmallCNN(nn.Module):
    def __init__(self, in_ch=1, out_dim=128):
        super().__init__()
        self.conv1 = nn.Conv2d(in_ch, 16, kernel_size=3, padding=1)
        self.bn1   = nn.BatchNorm2d(16)
        self.conv2 = nn.Conv2d(16, 32, kernel_size=3, padding=1)
        self.bn2   = nn.BatchNorm2d(32)
        self.conv3 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.bn3   = nn.BatchNorm2d(64)
        self.pool  = nn.AdaptiveAvgPool2d((8, 8))
        self.fc    = nn.Linear(64*8*8, out_dim)

    def forward(self, x):
        # x: (B, 1, mel, time)
        x = F.relu(self.bn1(self.conv1(x)))
        x = F.max_pool2d(x, 2)
        x = F.relu(self.bn2(self.conv2(x)))
        x = F.max_pool2d(x, 2)
        x = F.relu(self.bn3(self.conv3(x)))
        x = self.pool(x)
        x = x.flatten(1)
        x = self.fc(x)
        return x

class MLP(nn.Module):
    def __init__(self, in_dim, out_dim=128):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, 128),
            nn.ReLU(),
            nn.BatchNorm1d(128),
            nn.Dropout(0.1),
            nn.Linear(128, out_dim),
            nn.ReLU(),
        )
    def forward(self, x):
        return self.net(x)

class MultiModalClassifier(nn.Module):
    def __init__(self, audio_out=128, tab_out=128, num_tab=8):
        super().__init__()
        self.cnn = SmallCNN(1, audio_out)
        self.mlp = MLP(num_tab, tab_out)
        self.classifier = nn.Sequential(
            nn.Linear(audio_out + tab_out, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, 1)
        )

    def forward(self, spec, tab):
        a = self.cnn(spec)
        t = self.mlp(tab)
        x = torch.cat([a, t], dim=1)
        logit = self.classifier(x)
        return logit.squeeze(1)
